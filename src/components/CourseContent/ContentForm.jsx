import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import QuestionBuilder from '../QuestionBuilder/QuestionBuilder';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTrash2 } = FiIcons;

const ContentForm = ({ content, onSave, onCancel }) => {
  const [contentType, setContentType] = useState(content?.type || 'text');
  const [textContent, setTextContent] = useState(content?.content || '');
  const [quizQuestions, setQuizQuestions] = useState(content?.questions || []);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: content || {
      title: '',
      description: '',
      type: 'text',
      duration: '',
      url: '',
      file: null
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const contentData = {
        ...data,
        type: contentType,
        content: contentType === 'text' ? textContent : undefined,
        questions: contentType === 'quiz' ? quizQuestions : undefined,
        id: content?.id || Date.now().toString(),
        createdAt: content?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSave(contentData);
    } finally {
      setLoading(false);
    }
  };

  const addQuizQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1,
      explanation: ''
    };
    setQuizQuestions([...quizQuestions, newQuestion]);
  };

  const updateQuizQuestion = (questionId, updatedQuestion) => {
    setQuizQuestions(prev => 
      prev.map(q => q.id === questionId ? updatedQuestion : q)
    );
  };

  const deleteQuizQuestion = (questionId) => {
    setQuizQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const renderContentTypeFields = () => {
    switch (contentType) {
      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <RichTextEditor
              value={textContent}
              onChange={setTextContent}
              placeholder="Enter your lesson content..."
            />
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL
              </label>
              <input
                {...register('url', { required: 'Video URL is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
              />
              {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                {...register('duration')}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="15"
              />
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio URL
              </label>
              <input
                {...register('url', { required: 'Audio URL is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://example.com/audio.mp3"
              />
              {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                {...register('duration')}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="10"
              />
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Quiz Questions ({quizQuestions.length})
              </h3>
              <Button type="button" onClick={addQuizQuestion}>
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {quizQuestions.map((question, index) => (
                <QuestionBuilder
                  key={question.id}
                  question={question}
                  onChange={(updatedQuestion) => updateQuizQuestion(question.id, updatedQuestion)}
                  onDelete={() => deleteQuizQuestion(question.id)}
                />
              ))}
              
              {quizQuestions.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">No questions added yet</p>
                  <Button type="button" onClick={addQuizQuestion}>
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                    Add Your First Question
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter content title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="text">Text/Article</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            placeholder="Enter content description"
          />
        </div>

        {renderContentTypeFields()}

        <div className="flex items-center space-x-4 pt-4 border-t">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (content ? 'Update Content' : 'Create Content')}
          </Button>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContentForm;