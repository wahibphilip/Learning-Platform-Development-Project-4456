import React, { useState, useRef } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBold, FiItalic, FiUnderline, FiList, FiLink, FiImage, FiAlignLeft, FiAlignCenter, FiAlignRight } = FiIcons;

const RichTextEditor = ({ value = '', onChange, placeholder = 'Start typing...' }) => {
  const editorRef = useRef(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const toolbarButtons = [
    { icon: FiBold, command: 'bold', title: 'Bold' },
    { icon: FiItalic, command: 'italic', title: 'Italic' },
    { icon: FiUnderline, command: 'underline', title: 'Underline' },
    { icon: FiList, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: FiAlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: FiAlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: FiAlignRight, command: 'justifyRight', title: 'Align Right' },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="border-b border-gray-200 p-2 bg-gray-50">
        <div className="flex items-center space-x-1">
          {toolbarButtons.map((btn, index) => (
            <button
              key={index}
              type="button"
              onClick={() => execCommand(btn.command)}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title={btn.title}
            >
              <SafeIcon icon={btn.icon} className="w-4 h-4" />
            </button>
          ))}
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={insertLink}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Insert Link"
          >
            <SafeIcon icon={FiLink} className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertImage}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Insert Image"
          >
            <SafeIcon icon={FiImage} className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[200px] focus:outline-none"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleContentChange}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        style={{ minHeight: '200px' }}
      />
      {!value && !isEditorFocused && (
        <div className="absolute top-16 left-4 text-gray-400 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;