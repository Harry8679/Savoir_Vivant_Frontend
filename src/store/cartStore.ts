import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItemType = 'digital' | 'paper'

export interface CartItem {
  bookId:       string
  title:        string
  author:       string
  coverUrl:     string
  slug:         string
  type:         CartItemType
  price:        number
  digitalPrice: number
  paperPrice:   number
}

interface CartStore {
  items:    CartItem[]
  addItem:  (item: CartItem) => void
  removeItem: (bookId: string, type: CartItemType) => void
  updateType: (bookId: string, type: CartItemType) => void
  clearCart:  () => void
  total:      () => number
  count:      () => number
  hasItem:    (bookId: string, type: CartItemType) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const exists = get().items.find(
          i => i.bookId === item.bookId && i.type === item.type
        )
        if (exists) return // déjà dans le panier
        set(state => ({ items: [...state.items, item] }))
      },

      removeItem: (bookId, type) => {
        set(state => ({
          items: state.items.filter(i => !(i.bookId === bookId && i.type === type))
        }))
      },

      updateType: (bookId, type) => {
        set(state => ({
          items: state.items.map(i =>
            i.bookId === bookId
              ? { ...i, type, price: type === 'digital' ? i.digitalPrice : i.paperPrice }
              : i
          )
        }))
      },

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((acc, i) => acc + i.price, 0),

      count: () => get().items.length,

      hasItem: (bookId, type) =>
        get().items.some(i => i.bookId === bookId && i.type === type),
    }),
    {
      name: 'savoirvivant-cart',
    }
  )
)