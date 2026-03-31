export interface Collection {
  _id:         string
  name:        string
  slug:        string
  description: string
  color:       string
  coverUrl?:   string
}

export interface Book {
  _id:                       string
  title:                     string
  slug:                      string
  description:               string
  coverUrl:                  string
  collectionId:              Collection
  levels:                    ('college' | 'lycee' | 'prepa' | 'superieur')[]
  tags:                      string[]
  digitalPrice:              number
  paperPrice:                number
  author:                    string
  pageCount?:                number
  isAvailableInSubscription: boolean
  isPublished:               boolean
  publishedAt?:              string
}

export interface BooksResponse {
  books:      Book[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
}

export interface BookFilters {
  collectionId?: string
  level?:        string
  search?:       string
  page?:         number
  limit?:        number
}

export const LEVEL_LABELS: Record<string, string> = {
  college:   'Collège',
  lycee:     'Lycée / Terminale',
  prepa:     'Prépa (MPSI/MP)',
  superieur: 'Supérieur / Université',
}