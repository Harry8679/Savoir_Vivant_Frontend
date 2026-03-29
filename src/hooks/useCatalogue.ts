import { useState, useEffect, useCallback } from 'react'
import { bookService } from '@services/book.service'
import { Book, BookFilters, Collection } from '@/types/book.types'
// import { Book, Collection, BookFilters } from '@appTypes/book.types'

export const useCatalogue = () => {
  const [books, setBooks]           = useState<Book[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [total, setTotal]           = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters]       = useState<BookFilters>({ page: 1, limit: 12 })

  const fetchCollections = useCallback(async () => {
    try {
      const data = await bookService.getCollections()
      setCollections(data)
    } catch {
      // ignore
    }
  }, [])

  const fetchBooks = useCallback(async (f: BookFilters) => {
    try {
      setLoading(true)
      setError(null)
      const data = await bookService.getAll(f)
      setBooks(data.books)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch {
      setError('Erreur lors du chargement des livres')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  useEffect(() => {
    fetchBooks(filters)
  }, [filters, fetchBooks])

  const updateFilters = (newFilters: Partial<BookFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  const setPage = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  return { books, collections, loading, error, total, totalPages, filters, updateFilters, setPage }
}