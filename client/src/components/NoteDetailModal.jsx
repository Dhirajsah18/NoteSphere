import React, { useState } from 'react';
import { 
  X, 
  Edit3, 
  Trash2, 
  Pin, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  Tag 
} from 'lucide-react';

export const NoteDetailModal = ({ 
  note, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onTogglePin 
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !note) return null;

  const handleCopy = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = note.content || '';
    const plainText = `${note.title}\n\n${tempDiv.textContent || tempDiv.innerText || ''}`;
    
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryClass = (category) => {
    switch (category) {
      case 'Personal':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Work':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Study':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Other':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getColorTheme = (color) => {
    switch (color) {
      case 'purple': // Terracotta
        return {
          card: 'bg-[#FFF7ED] border-[#FED7AA]',
          header: 'bg-[#FFEDD5]/60 border-[#FED7AA]',
        };
      case 'emerald': // Sage Green
        return {
          card: 'bg-[#F0FDF4] border-[#BBF7D0]',
          header: 'bg-[#DCFCE7]/60 border-[#BBF7D0]',
        };
      case 'amber': // Warm Amber
        return {
          card: 'bg-[#FEFCE8] border-[#FEF08A]',
          header: 'bg-[#FEF9C3]/60 border-[#FEF08A]',
        };
      case 'rose': // Soft Rose
        return {
          card: 'bg-[#FFF1F2] border-[#FECDD3]',
          header: 'bg-[#FFE4E6]/60 border-[#FECDD3]',
        };
      default:
        return {
          card: 'bg-white border-stone-200/90',
          header: 'bg-stone-50/70 border-stone-100',
        };
    }
  };

  const theme = getColorTheme(note.color);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-3xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in transition-colors ${theme.card}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${theme.header}`}>
          <div className="flex items-center gap-2.5">
            <span
              className={`px-3 py-1 text-xs font-bold rounded-lg border ${getCategoryClass(
                note.category
              )}`}
            >
              {note.category}
            </span>
            {note.isPinned && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                <Pin className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                Pinned
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Copy text to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-orange-600" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Toggle Pin */}
            <button
              onClick={() => onTogglePin(note._id)}
              className={`p-2 rounded-xl transition-colors ${
                note.isPinned
                  ? 'text-amber-800 bg-amber-100'
                  : 'text-stone-400 hover:text-amber-600 hover:bg-stone-100'
              }`}
              title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
            >
              <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-amber-600 text-amber-600' : ''}`} />
            </button>

            {/* Edit Button */}
            <button
              onClick={() => {
                onClose();
                onEdit(note);
              }}
              className="p-2 rounded-xl text-stone-400 hover:text-orange-600 hover:bg-stone-100 transition-colors"
              title="Edit Note"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => {
                onClose();
                onDelete(note._id);
              }}
              className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete Note"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-stone-200 mx-1" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Note Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight">
            {note.title}
          </h1>

          {/* Timestamps & Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 pb-4 border-b border-stone-100 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              Created {formatDate(note.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              Updated {formatDate(note.updatedAt)}
            </span>
          </div>

          {/* Rendered Rich Content */}
          <div
            className="rich-text-content text-sm sm:text-base leading-relaxed py-2 min-h-[120px]"
            dangerouslySetInnerHTML={{ __html: note.content || '<p class="text-stone-400 italic">No content in this note.</p>' }}
          />

          {/* Tags Footer */}
          {note.tags && note.tags.length > 0 && (
            <div className="pt-6 border-t border-stone-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-xs font-bold text-stone-500">Tags:</span>
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200 text-xs font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
