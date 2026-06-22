import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([])
  const currentNote = ref(null)
  const categories = ref([])
  const tags = ref([])
  const loading = ref(false)

  const fetchNotes = async (page = 1, pageSize = 10, filters = {}) => {
    loading.value = true
    try {
      const response = await api.get('/notes', {
        params: {
          page,
          pageSize,
          ...filters
        }
      })
      notes.value = response.data.data.list
      return response.data.data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchNoteDetail = async (id) => {
    try {
      const response = await api.get(`/notes/${id}`)
      currentNote.value = response.data.data
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  const createNote = async (noteData) => {
    try {
      const response = await api.post('/notes', noteData)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  const updateNote = async (id, noteData) => {
    try {
      const response = await api.put(`/notes/${id}`, noteData)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`)
    } catch (error) {
      throw error
    }
  }

  const fetchTags = async () => {
    try {
      const response = await api.get('/tags')
      tags.value = response.data.data
      return tags.value
    } catch (error) {
      throw error
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      categories.value = response.data.data
      return categories.value
    } catch (error) {
      throw error
    }
  }

  const summarizeNote = async (noteId) => {
    try {
      const response = await api.post('/ai/summarize', { noteId })
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  const generateQuestions = async (noteId, count = 5) => {
    try {
      const response = await api.post('/ai/generate-questions', { noteId, count })
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  return {
    notes,
    currentNote,
    categories,
    tags,
    loading,
    fetchNotes,
    fetchNoteDetail,
    createNote,
    updateNote,
    deleteNote,
    fetchTags,
    fetchCategories,
    summarizeNote,
    generateQuestions
  }
})