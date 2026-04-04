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
  quantity:     number
}

interface CartStore {
  items:          CartItem[]
  addItem:        (item: Omit<CartItem, 'quantity'>) => void
  removeItem:     (bookId: string, type: CartItemType) => void
  updateType:     (bookId: string, type: CartItemType) => void
  updateQuantity: (bookId: string, type: CartItemType, quantity: number) => void
  clearCart:      () => void
  total:          () => number
  count:          () => number
  hasItem:        (bookId: string, type: CartItemType) => boolean
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
        set(state => ({
          items: [...state.items, { ...item, quantity: 1 }],
        }))
      },

      removeItem: (bookId, type) => {
        set(state => ({
          items: state.items.filter(
            i => !(i.bookId === bookId && i.type === type)
          ),
        }))
      },

      updateType: (bookId, type) => {
        set(state => ({
          items: state.items.map(i =>
            i.bookId === bookId
              ? { ...i, type, price: type === 'digital' ? i.digitalPrice : i.paperPrice }
              : i
          ),
        }))
      },

      updateQuantity: (bookId, type, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId, type)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            i.bookId === bookId && i.type === type
              ? { ...i, quantity }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),

      count: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),

      hasItem: (bookId, type) =>
        get().items.some(i => i.bookId === bookId && i.type === type),
    }),
    {
      name: 'savoirvivant-cart',
    }
  )
)