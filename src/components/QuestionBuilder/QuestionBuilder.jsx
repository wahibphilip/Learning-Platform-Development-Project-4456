import React, { useState } from 'react';
import Button from '../common/Button';
import SafeIcon from '../common/SafeIcon';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTrash2, FiMove } = FiIcons;

const QuestionBuilder = ({ question, onChange, onDelete }) => {
  const [localQuestion, setLocalQuestion] = useState(question || {
    id: Date.now().toString(),
    type: 'multiple-choice',
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1,
    explanation: '',
    timeLimit: 60
  });

  const handleChange = (field, value) => {
    const updated = { ...localQuestion, [field]: value };
    setLocalQuestion(updated);
    onChange(updated);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...localQuestion.options];
    newOptions[index] = value;
    handleChange('options', newOptions);
  };

  const addOption = () => {
    handleChange('options', [...localQuestion.options, '']);
  };

  const removeOption = (index) => {
    const newOptions = localQuestion.options.filter((_, i) => i !== index);
    handleChange('options', newOptions);
    if (localQuestion.correctAnswer >= newOptions.length) {
      handleChange('correctAnswer', 0);
    }
  };

  const renderQuestionInput = () => {
    switch (localQuestion.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text
              </label>
              <RichTextEditor
                value={localQuestion.text}
                onChange={(value) => handleChange('text', value)}
                placeholder="Enter your question..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer Options
              </label>
              <div className="space-y-2">
                {localQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`correct-${localQuestion.id}`}
                      checked={localQuestion.correctAnswer === index}
                      onChange={() => handleChange('correctAnswer', index)}
                      className="text-primary-600"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={`Option ${index + 1}`}
                    />
                    {localQuestion.options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                className="mt-2"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                Add Option
              </Button>
            </div>
          </div>
        );

      case 'true-false':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text
              </label>
              <RichTextEditor
                value={localQuestion.text}
                onChange={(value) => handleChange('text', value)}
                placeholder="Enter your true/false question..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answer
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`tf-${localQuestion.id}`}
                    checked={localQuestion.correctAnswer === 'true'}
                    onChange={() => handleChange('correctAnswer', 'true')}
                    className="text-primary-600"
                  />
                  <span className="ml-2">True</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`tf-${localQuestion.id}`}
                    checked={localQuestion.correctAnswer === 'false'}
                    onChange={() => handleChange('correctAnswer', 'false')}
                    className="text-primary-600"
                  />
                  <span className="ml-2">False</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'short-answer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text
              </label>
              <RichTextEditor
                value={localQuestion.text}
                onChange={(value) => handleChange('text', value)}
                placeholder="Enter your question..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sample Answer (for grading reference)
              </label>
              <textarea
                value={localQuestion.sampleAnswer || ''}
                onChange={(e) => handleChange('sampleAnswer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                placeholder="Enter a sample correct answer..."
              />
            </div>
          </div>
        );

      case 'essay':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Essay Prompt
              </label>
              <RichTextEditor
                value={localQuestion.text}
                onChange={(value) => handleChange('text', value)}
                placeholder="Enter your essay prompt..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Word Limit
              </label>
              <input
                type="number"
                value={localQuestion.wordLimit || 500}
                onChange={(e) => handleChange('wordLimit', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="50"
                max="2000"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiMove} className="w-5 h-5 text-gray-400 cursor-move" />
          <select
            value={localQuestion.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
            <option value="short-answer">Short Answer</option>
            <option value="essay">Essay</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Points:</label>
            <input
              type="number"
              value={localQuestion.points}
              onChange={(e) => handleChange('points', parseInt(e.target.value))}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
              min="1"
              max="100"
            />
          </div>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onDelete}
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {renderQuestionInput()}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Limit (seconds)
            </label>
            <input
              type="number"
              value={localQuestion.timeLimit}
              onChange={(e) => handleChange('timeLimit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="10"
              max="3600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explanation (optional)
            </label>
            <textarea
              value={localQuestion.explanation}
              onChange={(e) => handleChange('explanation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={2}
              placeholder="Explain the correct answer..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBuilder;