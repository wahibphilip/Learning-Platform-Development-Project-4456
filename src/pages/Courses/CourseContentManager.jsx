import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SafeIcon from '../../components/common/SafeIcon';
import ContentItem from '../../components/CourseContent/ContentItem';
import ContentForm from '../../components/CourseContent/ContentForm';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiPlus, FiArrowLeft, FiBook, FiPlay, FiHeadphones, FiFileText, FiHelpCircle } = FiIcons;

const CourseContentManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses } = useData();
  
  const course = courses.find(c => c.id === id);
  const [sections, setSections] = useState(course?.sections || [
    {
      id: '1',
      title: 'Getting Started',
      description: 'Introduction to the course',
      items: [
        {
          id: '1',
          title: 'Welcome to the Course',
          type: 'video',
          duration: '5 min',
          url: 'https://example.com/video1',
          description: 'Course overview and expectations'
        },
        {
          id: '2',
          title: 'Course Materials',
          type: 'text',
          duration: '10 min',
          content: '<h2>Required Materials</h2><p>List of materials needed for this course...</p>',
          description: 'Everything you need to get started'
        }
      ]
    }
  ]);

  const [showContentForm, setShowContentForm] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
        <Button onClick={() => navigate('/courses')} className="mt-4">
          Back to Courses
        </Button>
      </div>
    );
  }

  const addSection = () => {
    setEditingSection(null);
    setShowSectionForm(true);
  };

  const addContent = (sectionId) => {
    setSelectedSection(sectionId);
    setEditingContent(null);
    setShowContentForm(true);
  };

  const editContent = (content) => {
    setEditingContent(content);
    setShowContentForm(true);
  };

  const deleteContent = (sectionId, contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, items: section.items.filter(item => item.id !== contentId) }
          : section
      ));
      toast.success('Content deleted successfully');
    }
  };

  const saveContent = (contentData) => {
    if (editingContent) {
      setSections(prev => prev.map(section => ({
        ...section,
        items: section.items.map(item => 
          item.id === editingContent.id ? contentData : item
        )
      })));
      toast.success('Content updated successfully');
    } else {
      setSections(prev => prev.map(section => 
        section.id === selectedSection 
          ? { ...section, items: [...section.items, contentData] }
          : section
      ));
      toast.success('Content added successfully');
    }
    setShowContentForm(false);
    setEditingContent(null);
    setSelectedSection(null);
  };

  const saveSection = (sectionData) => {
    if (editingSection) {
      setSections(prev => prev.map(section => 
        section.id === editingSection.id ? { ...sectionData, items: section.items } : section
      ));
      toast.success('Section updated successfully');
    } else {
      setSections(prev => [...prev, { ...sectionData, id: Date.now().toString(), items: [] }]);
      toast.success('Section added successfully');
    }
    setShowSectionForm(false);
    setEditingSection(null);
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'video': return FiPlay;
      case 'audio': return FiHeadphones;
      case 'text': return FiFileText;
      case 'quiz': return FiHelpCircle;
      default: return FiFileText;
    }
  };

  const getTotalDuration = () => {
    let totalMinutes = 0;
    sections.forEach(section => {
      section.items.forEach(item => {
        if (item.duration) {
          const minutes = parseInt(item.duration.replace(/\D/g, ''));
          totalMinutes += minutes || 0;
        }
      });
    });
    return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/courses')}>
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-1">Manage course content and structure</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={addSection}>
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
              <div className="text-sm text-gray-500">
                {sections.reduce((acc, section) => acc + section.items.length, 0)} items • {getTotalDuration()}
              </div>
            </div>

            <div className="space-y-6">
              {sections.map((section, sectionIndex) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addContent(section.id)}
                    >
                      <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                      Add Content
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <ContentItem
                        key={item.id}
                        item={item}
                        onEdit={editContent}
                        onDelete={(contentId) => deleteContent(section.id, contentId)}
                        onClick={() => {}}
                      />
                    ))}
                    
                    {section.items.length === 0 && (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <SafeIcon icon={FiBook} className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-4">No content in this section yet</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addContent(section.id)}
                        >
                          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                          Add First Content
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {sections.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <SafeIcon icon={FiBook} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
                  <p className="text-gray-600 mb-4">Start building your course by adding sections</p>
                  <Button onClick={addSection}>
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                    Add First Section
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Overview</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Content</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sections.reduce((acc, section) => acc + section.items.length, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-xl font-semibold text-gray-900">{getTotalDuration()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sections</p>
                <p className="text-xl font-semibold text-gray-900">{sections.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Types</h3>
            <div className="space-y-3">
              {['video', 'audio', 'text', 'quiz'].map(type => {
                const count = sections.reduce((acc, section) => 
                  acc + section.items.filter(item => item.type === type).length, 0
                );
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={getContentTypeIcon(type)} className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700 capitalize">{type}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showContentForm}
        onClose={() => {
          setShowContentForm(false);
          setEditingContent(null);
          setSelectedSection(null);
        }}
        title={editingContent ? 'Edit Content' : 'Add New Content'}
        size="xl"
      >
        <ContentForm
          content={editingContent}
          onSave={saveContent}
          onCancel={() => {
            setShowContentForm(false);
            setEditingContent(null);
            setSelectedSection(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showSectionForm}
        onClose={() => {
          setShowSectionForm(false);
          setEditingSection(null);
        }}
        title={editingSection ? 'Edit Section' : 'Add New Section'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter section title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="Enter section description"
            />
          </div>
          <div className="flex items-center space-x-4 pt-4">
            <Button onClick={() => saveSection({ title: 'New Section', description: 'Section description' })}>
              Save Section
            </Button>
            <Button variant="outline" onClick={() => setShowSectionForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CourseContentManager;