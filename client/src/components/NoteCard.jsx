import React from 'react';
import { 
  Pin, 
  Edit3, 
  Trash2, 
  Eye, 
  Calendar, 
  Clock 
} from 'lucide-react';

export const NoteCard = ({ 
  note, 
  onEdit, 
  onDelete, 
  onTogglePin, 
  onView, 
  viewMode = 'grid' 
}) => {
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
        return 'bg-[#FFF7ED] hover:bg-[#FFEDD5] border-[#FED7AA] hover:border-[#FDBA74]';
      case 'emerald': // Sage Green
        return 'bg-[#F0FDF4] hover:bg-[#DCFCE7] border-[#BBF7D0] hover:border-[#86EFAC]';
      case 'amber': // Warm Amber
        return 'bg-[#FEFCE8] hover:bg-[#FEF9C3] border-[#FEF08A] hover:border-[#FDE047]';
      case 'rose': // Soft Rose
        return 'bg-[#FFF1F2] hover:bg-[#FFE4E6] border-[#FECDD3] hover:border-[#FDA4AF]';
      default:
        return 'bg-white hover:bg-stone-50/50 border-stone-200/90 hover:border-orange-300';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Strip HTML tags for clean card excerpt preview
  const getCleanExcerpt = (htmlContent) => {
    if (!htmlContent) return 'No additional text...';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.trim() || 'Rich content attached...';
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onView(note)}
        className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:shadow-md ${getColorTheme(
          note.color
        )} ${note.isPinned ? 'ring-2 ring-amber-400/80 border-amber-300 bg-amber-50/30' : ''}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg border shadow-2xs ${getCategoryClass(
                note.category
              )}`}
            >
              {note.category}
            </span>
            {note.isPinned && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                <Pin className="w-3 h-3 fill-amber-600 text-amber-600" />
                Pinned
              </span>
            )}
            <span className="text-[11px] text-stone-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {formatDate(note.updatedAt || note.createdAt)}
            </span>
          </div>
          
          <h3 className="text-base font-bold text-stone-900 truncate group-hover:text-orange-600 transition-colors">
            {note.title}
          </h3>
          
          <p className="text-xs text-stone-500 truncate mt-1 font-medium">
            {getCleanExcerpt(note.content)}
          </p>
        </div>

        {/* Action buttons */}
        <div
          className="flex items-center gap-1 self-end sm:self-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onTogglePin(note._id)}
            className={`p-2 rounded-xl border transition-all ${
              note.isPinned
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'text-stone-400 hover:text-amber-600 hover:bg-stone-100 border-transparent'
            }`}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-amber-600 text-amber-600' : ''}`} />
          </button>
          <button
            onClick={() => onView(note)}
            className="p-2 rounded-xl text-stone-400 hover:text-orange-600 hover:bg-stone-100 border border-transparent transition-all"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(note)}
            className="p-2 rounded-xl text-stone-400 hover:text-orange-600 hover:bg-stone-100 border border-transparent transition-all"
            title="Edit Note"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent transition-all"
            title="Delete Note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Grid view card
  return (
    <div
      onClick={() => onView(note)}
      className={`group cursor-pointer rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between h-[230px] shadow-xs hover:shadow-lg ${getColorTheme(
        note.color
      )} ${note.isPinned ? 'ring-2 ring-amber-400/80 border-amber-300 shadow-amber-500/5' : ''}`}
    >
      <div>
        {/* Card Header: Category & Pin button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg border shadow-2xs tracking-wide ${getCategoryClass(
              note.category
            )}`}
          >
            {note.category}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note._id);
            }}
            className={`p-1.5 rounded-lg transition-all ${
              note.isPinned
                ? 'text-amber-800 bg-amber-100'
                : 'text-stone-300 hover:text-amber-600 opacity-0 group-hover:opacity-100 hover:bg-stone-100'
            }`}
            title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
          >
            <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-amber-600' : ''}`} />
          </button>
        </div>

        {/* Note Title */}
        <h3 className="text-base font-bold text-stone-900 line-clamp-1 group-hover:text-orange-600 transition-colors mb-2">
          {note.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed font-normal">
          {getCleanExcerpt(note.content)}
        </p>
      </div>

      {/* Card Footer: Tags, Date and Action controls */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-hidden pr-2">
          {note.tags && note.tags.length > 0 ? (
            <span className="text-[10px] font-bold text-orange-800 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md truncate max-w-[120px]">
              #{note.tags[0]}
              {note.tags.length > 1 ? ` +${note.tags.length - 1}` : ''}
            </span>
          ) : (
            <span className="text-[10px] text-stone-400 font-semibold flex items-center gap-1">
              <Calendar className="w-3 h-3 text-stone-400" />
              {formatDate(note.createdAt)}
            </span>
          )}
        </div>

        {/* Hover Action controls */}
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-orange-600 hover:bg-stone-100 transition-colors"
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
