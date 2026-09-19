import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Pin, 
  Tag, 
  Check, 
  Palette, 
  Type, 
  ChevronDown,
  Baseline
} from 'lucide-react';

export const NoteEditorModal = ({ isOpen, onClose, onSave, noteToEdit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Personal');
  const [isPinned, setIsPinned] = useState(false);
  const [color, setColor] = useState('default');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [fontSize, setFontSize] = useState('3');
  const [showTextColorMenu, setShowTextColorMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const editorRef = useRef(null);
  const savedSelectionRef = useRef(null);

  const categories = ['Personal', 'Work', 'Study', 'Other'];

  const colorOptions = [
    { id: 'default', label: 'White / Default', bg: 'bg-white border-stone-300' },
    { id: 'purple', label: 'Terracotta', bg: 'bg-[#FED7AA] border-orange-400' },
    { id: 'emerald', label: 'Sage Green', bg: 'bg-[#BBF7D0] border-emerald-400' },
    { id: 'amber', label: 'Warm Amber', bg: 'bg-[#FEF08A] border-amber-400' },
    { id: 'rose', label: 'Soft Rose', bg: 'bg-[#FECDD3] border-rose-400' },
  ];

  const textColors = [
    { label: 'Charcoal (Default)', color: '#1c1917', bg: 'bg-stone-900' },
    { label: 'Terracotta', color: '#ea580c', bg: 'bg-orange-600' },
    { label: 'Forest Green', color: '#15803d', bg: 'bg-emerald-700' },
    { label: 'Warm Amber', color: '#b45309', bg: 'bg-amber-600' },
    { label: 'Rose Red', color: '#e11d48', bg: 'bg-rose-600' },
    { label: 'Slate Gray', color: '#64748b', bg: 'bg-slate-500' },
  ];

  const fontSizes = [
    { value: '1', label: 'Small (12px)' },
    { value: '2', label: 'Normal (14px)' },
    { value: '3', label: 'Medium (16px)' },
    { value: '4', label: 'Large (19px)' },
    { value: '5', label: 'X-Large (24px)' },
    { value: '6', label: 'Huge (30px)' },
    { value: '7', label: 'Giant (36px)' },
  ];

  const getModalTheme = (c) => {
    switch (c) {
      case 'purple': // Terracotta
        return {
          card: 'bg-[#FFF7ED] border-[#FED7AA]',
          header: 'bg-[#FFEDD5]/60 border-[#FED7AA]',
          footer: 'bg-[#FFEDD5]/40 border-[#FED7AA]',
          name: 'Terracotta'
        };
      case 'emerald': // Sage
        return {
          card: 'bg-[#F0FDF4] border-[#BBF7D0]',
          header: 'bg-[#DCFCE7]/60 border-[#BBF7D0]',
          footer: 'bg-[#DCFCE7]/40 border-[#BBF7D0]',
          name: 'Sage Green'
        };
      case 'amber': // Amber
        return {
          card: 'bg-[#FEFCE8] border-[#FEF08A]',
          header: 'bg-[#FEF9C3]/60 border-[#FEF08A]',
          footer: 'bg-[#FEF9C3]/40 border-[#FEF08A]',
          name: 'Warm Amber'
        };
      case 'rose': // Rose
        return {
          card: 'bg-[#FFF1F2] border-[#FECDD3]',
          header: 'bg-[#FFE4E6]/60 border-[#FECDD3]',
          footer: 'bg-[#FFE4E6]/40 border-[#FECDD3]',
          name: 'Soft Rose'
        };
      default:
        return {
          card: 'bg-white border-stone-200/90',
          header: 'bg-stone-50/70 border-stone-100',
          footer: 'bg-stone-50/70 border-stone-100',
          name: 'Default White'
        };
    }
  };

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title || '');
      setContent(noteToEdit.content || '');
      setCategory(noteToEdit.category || 'Personal');
      setIsPinned(Boolean(noteToEdit.isPinned));
      setColor(noteToEdit.color || 'default');
      setTags(noteToEdit.tags || []);
      setFontSize('3');
      if (editorRef.current) {
        editorRef.current.innerHTML = noteToEdit.content || '';
      }
    } else {
      setTitle('');
      setContent('');
      setCategory('Personal');
      setIsPinned(false);
      setColor('default');
      setTags([]);
      setFontSize('3');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    }
    setError('');
    setShowTextColorMenu(false);
  }, [noteToEdit, isOpen]);

  if (!isOpen) return null;

  // Save selection before dropdown click
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      savedSelectionRef.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  // Rich Text command executor
  const executeCommand = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleFontSizeChange = (sizeVal) => {
    setFontSize(sizeVal);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();
    executeCommand('fontSize', sizeVal);
  };

  const handleTextColorChange = (hexColor) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();
    executeCommand('foreColor', hexColor);
    setShowTextColorMenu(false);
  };

  const handleIncreaseFontSize = () => {
    const current = parseInt(fontSize, 10) || 3;
    const next = Math.min(current + 1, 7);
    handleFontSizeChange(String(next));
  };

  const handleDecreaseFontSize = () => {
    const current = parseInt(fontSize, 10) || 3;
    const next = Math.max(current - 1, 1);
    handleFontSizeChange(String(next));
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Tags management
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/^#/, '');
      if (cleaned && !tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for your note.');
      return;
    }

    setLoading(true);
    setError('');

    const currentEditorContent = editorRef.current ? editorRef.current.innerHTML : content;

    try {
      await onSave({
        title: title.trim(),
        content: currentEditorContent,
        category,
        isPinned,
        color,
        tags,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save note.');
    } finally {
      setLoading(false);
    }
  };

  const modalTheme = getModalTheme(color);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-in transition-colors duration-200 ${modalTheme.card}`}
        onClick={(e) => {
          e.stopPropagation();
          setShowTextColorMenu(false);
        }}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b transition-colors ${modalTheme.header}`}>
          <h2 className="text-base font-extrabold text-stone-900">
            {noteToEdit ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title..."
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 font-bold text-lg placeholder-stone-400 focus:bg-white focus:outline-none focus:border-orange-600 focus:ring-3 focus:ring-orange-600/15 shadow-2xs"
              autoFocus
            />
          </div>

          {/* Category & Pin Selection */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-600">Category:</span>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      category === cat
                        ? cat === 'Personal'
                          ? 'bg-orange-100 text-orange-800 border-orange-300 shadow-xs'
                          : cat === 'Work'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs'
                          : cat === 'Study'
                          ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-xs'
                          : 'bg-stone-200 text-stone-800 border-stone-400 shadow-xs'
                        : 'bg-white/80 text-stone-600 border-stone-200 hover:bg-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Pin Toggle */}
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                isPinned
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                  : 'bg-white/80 text-stone-600 border-stone-200 hover:bg-white'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-amber-600 text-amber-600' : 'text-stone-400'}`} />
              <span>{isPinned ? 'Pinned' : 'Pin to top'}</span>
            </button>
          </div>

          {/* Rich Text Editor Toolbar */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-stone-200 bg-stone-50">
              
              {/* Font Size Dropdown */}
              <div className="flex items-center gap-1 mr-1">
                <div className="relative flex items-center">
                  <Type className="w-3.5 h-3.5 text-stone-500 absolute left-2 pointer-events-none" />
                  <select
                    value={fontSize}
                    onMouseDown={saveSelection}
                    onChange={(e) => handleFontSizeChange(e.target.value)}
                    aria-label="Text Size"
                    className="appearance-none pl-7 pr-6 py-1 text-xs font-bold bg-white border border-stone-200 rounded-lg text-stone-700 hover:border-stone-300 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600/20 cursor-pointer shadow-2xs"
                  >
                    {fontSizes.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-stone-400 absolute right-1.5 pointer-events-none" />
                </div>

                {/* Quick Font Size Buttons A- and A+ */}
                <button
                  type="button"
                  onMouseDown={saveSelection}
                  onClick={handleDecreaseFontSize}
                  className="px-2 py-1 rounded-lg text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200/80 border border-stone-200 bg-white"
                  title="Decrease Text Size (A-)"
                >
                  A<span className="text-[10px] -top-1 relative">−</span>
                </button>
                <button
                  type="button"
                  onMouseDown={saveSelection}
                  onClick={handleIncreaseFontSize}
                  className="px-2 py-1 rounded-lg text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200/80 border border-stone-200 bg-white"
                  title="Increase Text Size (A+)"
                >
                  A<span className="text-[10px] -top-1 relative">+</span>
                </button>
              </div>

              {/* Text Color Picker */}
              <div className="relative">
                <button
                  type="button"
                  onMouseDown={saveSelection}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTextColorMenu(!showTextColorMenu);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200/80 border border-stone-200 bg-white"
                  title="Text Color"
                >
                  <Baseline className="w-3.5 h-3.5 text-orange-600" />
                  <span>Color</span>
                  <ChevronDown className="w-2.5 h-2.5 text-stone-400" />
                </button>

                {showTextColorMenu && (
                  <div
                    className="absolute left-0 mt-1 p-2 bg-white border border-stone-200 rounded-xl shadow-xl z-30 flex flex-col gap-1 w-44 animate-scale-in"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[10px] font-black uppercase text-stone-400 px-1 mb-1">
                      Choose Text Color
                    </span>
                    {textColors.map((tc) => (
                      <button
                        key={tc.color}
                        type="button"
                        onClick={() => handleTextColorChange(tc.color)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold text-stone-700 hover:bg-stone-100 text-left transition-colors"
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${tc.bg}`} />
                        <span>{tc.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-[1px] h-4 bg-stone-300 mx-1" />

              {/* Bold, Italic, Underline, Strikethrough */}
              <button
                type="button"
                onClick={() => executeCommand('bold')}
                className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/80"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('italic')}
                className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/80"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('underline')}
                className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/80"
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('strikeThrough')}
                className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/80"
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-4 bg-stone-300 mx-1" />

              {/* Headings */}
              <button
                type="button"
                onClick={() => executeCommand('formatBlock', '<h1>')}
                className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/80"
                title="Heading 1"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('formatBlock', '<h2>')}
                className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/80"
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('formatBlock', '<h3>')}
                className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/80"
                title="Heading 3"
              >
                <Heading3 className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-4 bg-stone-300 mx-1" />

              {/* Lists, Quote & Code */}
              <button
                type="button"
                onClick={() => executeCommand('insertUnorderedList')}
                className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/80"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('insertOrderedList')}
                className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/80"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('formatBlock', '<blockquote>')}
                className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/80"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('formatBlock', '<pre>')}
                className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/80"
                title="Code Block"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>

            {/* Editable Content Area */}
            <div
              ref={editorRef}
              onMouseUp={saveSelection}
              onKeyUp={saveSelection}
              contentEditable
              onInput={handleEditorInput}
              data-placeholder="Write your note content here with rich text formatting..."
              className="min-h-[180px] max-h-[280px] overflow-y-auto p-4 text-sm text-stone-800 focus:outline-none rich-text-content bg-white"
              style={{ minHeight: '180px' }}
            />
          </div>

          {/* Card Background Color Picker */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-white/80 border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-orange-600" />
                Note Background Color:
              </span>
              <span className="text-xs font-semibold text-stone-500">({modalTheme.name})</span>
            </div>

            <div className="flex items-center gap-2">
              {colorOptions.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setColor(col.id)}
                  className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center shadow-xs ${col.bg} ${
                    color === col.id ? 'ring-2 ring-orange-500 scale-110' : 'hover:scale-105'
                  }`}
                  title={`Select ${col.label} background`}
                >
                  {color === col.id && <Check className="w-3.5 h-3.5 text-stone-800 stroke-[2.5]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-orange-600" />
              Tags (Press Enter to add):
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-white border border-stone-200">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200 text-xs font-bold"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? "e.g. project, urgent, ideas" : "Add tag..."}
                className="bg-transparent text-xs text-stone-800 placeholder-stone-400 focus:outline-none flex-1 min-w-[120px]"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className={`flex items-center justify-end gap-2.5 px-6 py-4 border-t transition-colors ${modalTheme.footer}`}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-white/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm shadow-orange-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Saving...' : noteToEdit ? 'Update Note' : 'Create Note'}
          </button>
        </div>
      </div>
    </div>
  );
};
