import React, { useState, useEffect, useCallback } from 'react';
import { 
  getNotes, 
  createNote, 
  updateNote, 
  deleteNote, 
  togglePinNote 
} from '../api/notes';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { NoteCard } from '../components/NoteCard';
import { NoteEditorModal } from '../components/NoteEditorModal';
import { NoteDetailModal } from '../components/NoteDetailModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { Toast } from '../components/Toast';
import { 
  Plus, 
  FileText, 
  Search, 
  Pin, 
  Layers, 
  BookOpen 
} from 'lucide-react';

export const DashboardPage = () => {
  // State
  const [notes, setNotes] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({
    all: 0,
    Personal: 0,
    Work: 0,
    Study: 0,
    Other: 0,
    Pinned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isPinnedFilter, setIsPinnedFilter] = useState(false);
  const [sortBy, setSortBy] = useState('updated');
  const [viewMode, setViewMode] = useState('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 3500);
  };

  // Fetch notes function
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotes({
        search: search.trim(),
        category: selectedCategory,
        isPinned: isPinnedFilter ? true : undefined,
        sortBy,
      });

      if (data.success) {
        setNotes(data.notes);
        if (data.categoryCounts) {
          setCategoryCounts(data.categoryCounts);
        }
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      showToast(err.response?.data?.message || 'Failed to fetch notes', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, isPinnedFilter, sortBy]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchNotes]);

  // Handlers
  const handleOpenCreateModal = () => {
    setNoteToEdit(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setNoteToEdit(note);
    setIsEditorOpen(true);
  };

  const handleOpenDetailModal = (note) => {
    setSelectedNote(note);
    setIsDetailOpen(true);
  };

  const handleOpenDeleteModal = (id) => {
    setNoteIdToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    if (noteToEdit) {
      const res = await updateNote(noteToEdit._id, noteData);
      if (res.success) {
        showToast('Note updated successfully!', 'success');
        fetchNotes();
      }
    } else {
      const res = await createNote(noteData);
      if (res.success) {
        showToast('New note created successfully!', 'success');
        fetchNotes();
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!noteIdToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await deleteNote(noteIdToDelete);
      if (res.success) {
        showToast('Note deleted successfully', 'info');
        setIsDeleteOpen(false);
        setNoteIdToDelete(null);
        fetchNotes();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete note', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const res = await togglePinNote(id);
      if (res.success) {
        showToast(res.message, 'success');
        fetchNotes();
        if (selectedNote && selectedNote._id === id) {
          setSelectedNote({ ...selectedNote, isPinned: res.isPinned });
        }
      }
    } catch (err) {
      showToast('Failed to update pin state', 'error');
    }
  };

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const regularNotes = isPinnedFilter ? notes : notes.filter((n) => !n.isPinned);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col selection:bg-orange-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenCreateModal={handleOpenCreateModal}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area - Full Width Flush with Sidebar */}
      <div className="flex-1 flex w-full">
        {/* Left Sidebar */}
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isPinnedFilter={isPinnedFilter}
          setIsPinnedFilter={setIsPinnedFilter}
        />

        {/* Main Dashboard Canvas */}
        <main className="flex-1 w-full p-5 sm:p-7 lg:p-9 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200/90">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {isPinnedFilter
                    ? 'Pinned Notes'
                    : selectedCategory === 'All'
                    ? 'All Notes'
                    : `${selectedCategory} Notes`}
                </h1>
                <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200 shadow-2xs">
                  {notes.length}
                </span>
              </div>
              {search && (
                <p className="text-xs text-stone-500 mt-1 font-semibold">
                  Search results for: <span className="text-orange-600 font-extrabold underline">"{search}"</span>
                </p>
              )}
            </div>

            {/* Mobile Category Pill indicator */}
            <div className="flex items-center gap-2 md:hidden">
              <span className="text-xs text-stone-400 font-bold">Category:</span>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-white border border-stone-200 text-stone-800 shadow-xs">
                {isPinnedFilter ? 'Pinned' : selectedCategory}
              </span>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                <div
                  key={idx}
                  className="h-56 rounded-3xl bg-white border border-stone-200/80 animate-pulse p-5 flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="w-20 h-5 bg-stone-100 rounded-lg" />
                    <div className="w-3/4 h-6 bg-stone-100 rounded-lg" />
                    <div className="w-full h-14 bg-stone-50 rounded-xl" />
                  </div>
                  <div className="w-1/3 h-4 bg-stone-100 rounded-md" />
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            /* Modern Elevated Empty State in Terracotta & Amber */
            <div className="bg-white rounded-3xl p-10 sm:p-16 text-center max-w-xl mx-auto my-12 border border-stone-200/90 shadow-md">
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-orange-50 border border-orange-100 p-0.5 shadow-sm mb-5">
                {search ? (
                  <Search className="w-9 h-9 text-orange-600" />
                ) : (
                  <BookOpen className="w-9 h-9 text-orange-600" />
                )}
              </div>
              <h3 className="text-xl font-extrabold text-stone-900 mb-2 tracking-tight">
                {search ? 'No matching notes found' : 'No notes here yet'}
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed mb-7 font-normal max-w-md mx-auto">
                {search
                  ? `We couldn't find any notes matching "${search}". Try searching with different keywords or clear the search.`
                  : isPinnedFilter
                  ? "You haven't pinned any notes to the top yet. Pin important notes for quick 1-click access."
                  : `Start writing and organizing your thoughts in ${selectedCategory !== 'All' ? selectedCategory : 'your workspace'} right now!`}
              </p>
              {!search && (
                <button
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-extrabold shadow-md shadow-orange-600/25 transition-all duration-200 active:scale-95"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                  <span>Create Your First Note</span>
                </button>
              )}
            </div>
          ) : (
            /* Notes List / Grid */
            <div className="space-y-8">
              {/* Pinned section if in All / category view and pinned notes exist */}
              {!isPinnedFilter && pinnedNotes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1 rounded-lg bg-amber-100 border border-amber-300">
                      <Pin className="w-4 h-4 text-amber-600 fill-amber-600" />
                    </div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-amber-900">
                      Pinned Notes ({pinnedNotes.length})
                    </h2>
                  </div>
                  <div
                    className={`grid gap-5 ${
                      viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                    }`}
                  >
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        viewMode={viewMode}
                        onEdit={handleOpenEditModal}
                        onDelete={handleOpenDeleteModal}
                        onTogglePin={handleTogglePin}
                        onView={handleOpenDetailModal}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Other Notes Section */}
              <div>
                {!isPinnedFilter && pinnedNotes.length > 0 && regularNotes.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 pt-2">
                    <div className="p-1 rounded-lg bg-stone-100 border border-stone-200">
                      <Layers className="w-4 h-4 text-stone-600" />
                    </div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-stone-600">
                      Other Notes ({regularNotes.length})
                    </h2>
                  </div>
                )}

                <div
                  className={`grid gap-5 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  }`}
                >
                  {regularNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      viewMode={viewMode}
                      onEdit={handleOpenEditModal}
                      onDelete={handleOpenDeleteModal}
                      onTogglePin={handleTogglePin}
                      onView={handleOpenDetailModal}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={handleOpenCreateModal}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xl shadow-orange-600/40 z-30 active:scale-95"
        aria-label="Create note"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Modals */}
      <NoteEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
        noteToEdit={noteToEdit}
      />

      <NoteDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        note={selectedNote}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        onTogglePin={handleTogglePin}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      {/* Toast notification */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}
    </div>
  );
};
