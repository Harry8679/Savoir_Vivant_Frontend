import { ApiResponse } from '@/types/auth.types'
import api from './api'
import { Book, BookFilters, BooksResponse, Collection } from '@/types/book.types'

export const bookService = {
  async getAll(filters: BookFilters = {}): Promise<BooksResponse> {
    const params = new URLSearchParams()
    if (filters.collectionId) params.set('collectionId', filters.collectionId)
    if (filters.level)        params.set('level', filters.level)
    if (filters.search)       params.set('search', filters.search)
    if (filters.page)         params.set('page', String(filters.page))
    if (filters.limit)        params.set('limit', String(filters.limit))
    const { data } = await api.get<ApiResponse<BooksResponse>>(`/books?${params}`)
    return data.data
  },

  async getBySlug(slug: string): Promise<Book> {
    const { data } = await api.get<ApiResponse<Book>>(`/books/slug/${slug}`)
    return data.data
  },

  async getById(id: string): Promise<Book> {
    const { data } = await api.get<ApiResponse<Book>>(`/books/${id}`)
    return data.data
  },

  async getCollections(): Promise<Collection[]> {
    const { data } = await api.get<ApiResponse<Collection[]>>('/collections')
    return data.data
  },

  async create(payload: Record<string, unknown>): Promise<Book> {
    const { data } = await api.post<ApiResponse<Book>>('/books', payload)
    return data.data
  },

  async update(id: string, payload: Partial<Book>): Promise<Book> {
    const { data } = await api.patch<ApiResponse<Book>>(`/books/${id}`, payload)
    return data.data
  },

  async publish(id: string): Promise<Book> {
    const { data } = await api.patch<ApiResponse<Book>>(`/books/${id}/publish`, {})
    return data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/books/${id}`)
  },

  async checkAccess(id: string): Promise<{ hasAccess: boolean }> {
    const { data } = await api.get<ApiResponse<{ hasAccess: boolean }>>(`/books/${id}/access`)
    return data.data
  },

  // Dans src/services/book.service.ts, ajoute cette méthode :
  async getReadUrl(bookId: string): Promise<{ url: string }> {
    const { data } = await api.get<ApiResponse<{ url: string }>>(`/books/${bookId}/read-url`)
    return data.data
  },
}