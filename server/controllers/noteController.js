const Note = require('../models/Note');

// @desc    Get all notes for current user (with search, category filter, pin filter, sorting)
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const { search, category, isPinned, sortBy } = req.query;

    // Base query: only fetch notes owned by the logged-in user
    let query = { user: req.user._id };

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Pinned filter
    if (isPinned !== undefined) {
      query.isPinned = isPinned === 'true';
    }

    // Search filter (searches title and content case-insensitively)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { content: searchRegex }, { tags: searchRegex }];
    }

    // Sorting logic
    let sortOption = { isPinned: -1, updatedAt: -1 }; // Pinned notes first by default, then latest updated

    if (sortBy) {
      switch (sortBy) {
        case 'newest':
          sortOption = { isPinned: -1, createdAt: -1 };
          break;
        case 'oldest':
          sortOption = { isPinned: -1, createdAt: 1 };
          break;
        case 'updated':
          sortOption = { isPinned: -1, updatedAt: -1 };
          break;
        case 'title_asc':
          sortOption = { isPinned: -1, title: 1 };
          break;
        case 'title_desc':
          sortOption = { isPinned: -1, title: -1 };
          break;
        default:
          sortOption = { isPinned: -1, updatedAt: -1 };
      }
    }

    const notes = await Note.find(query).sort(sortOption);

    // Calculate category counts for current user
    const totalNotes = await Note.countDocuments({ user: req.user._id });
    const personalCount = await Note.countDocuments({ user: req.user._id, category: 'Personal' });
    const workCount = await Note.countDocuments({ user: req.user._id, category: 'Work' });
    const studyCount = await Note.countDocuments({ user: req.user._id, category: 'Study' });
    const otherCount = await Note.countDocuments({ user: req.user._id, category: 'Other' });
    const pinnedCount = await Note.countDocuments({ user: req.user._id, isPinned: true });

    res.status(200).json({
      success: true,
      count: notes.length,
      categoryCounts: {
        all: totalNotes,
        Personal: personalCount,
        Work: workCount,
        Study: studyCount,
        Other: otherCount,
        Pinned: pinnedCount,
      },
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // Ensure note belongs to user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this note',
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { title, content, category, isPinned, color, tags } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title for the note',
      });
    }

    const note = await Note.create({
      user: req.user._id,
      title: title.trim(),
      content: content || '',
      category: category || 'Personal',
      isPinned: Boolean(isPinned),
      color: color || 'default',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' && tags ? tags.split(',').map(t => t.trim()) : [],
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // Ensure note belongs to user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this note',
      });
    }

    const { title, content, category, isPinned, color, tags } = req.body;

    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content;
    if (category !== undefined) note.category = category;
    if (isPinned !== undefined) note.isPinned = Boolean(isPinned);
    if (color !== undefined) note.color = color;
    if (tags !== undefined) {
      note.tags = Array.isArray(tags) ? tags : typeof tags === 'string' && tags ? tags.split(',').map(t => t.trim()) : [];
    }

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      note: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // Ensure note belongs to user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this note',
      });
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle note pin status
// @route   PATCH /api/notes/:id/pin
// @access  Private
const togglePinNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this note',
      });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json({
      success: true,
      message: note.isPinned ? 'Note pinned to top' : 'Note unpinned',
      isPinned: note.isPinned,
      note,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  togglePinNote,
};
