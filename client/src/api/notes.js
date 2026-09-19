import api from './axios';

export const getNotes = async ({ search = '', category = 'All', isPinned, sortBy = 'updated' } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (category && category !== 'All') params.category = category;
  if (isPinned !== undefined) params.isPinned = isPinned;
  if (sortBy) params.sortBy = sortBy;

  const response = await api.get('/notes', { params });
  return response.data;
};

export const getNoteById = async (id) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await api.post('/notes', noteData);
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

export const togglePinNote = async (id) => {
  const response = await api.patch(`/notes/${id}/pin`);
  return response.data;
};
