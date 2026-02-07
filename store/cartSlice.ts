import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"

export type CartItem = {
  id: string
  serviceId: string
  serviceName: string
  price: number
  date: string
  time: string
  photos: string[] // Cloudinary URLs
}

interface CartState {
  items: CartItem[]
  isLoading: boolean
}

const initialState: CartState = {
  items: [],
  isLoading: true,
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initializeCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
      state.isLoading = false
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
    updateCartItem: (state, action: PayloadAction<{ id: string; updates: Partial<CartItem> }>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.updates }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { initializeCart, addToCart, removeFromCart, clearCart, updateCartItem, setLoading } = cartSlice.actions

// Selectors
export const selectCart = (state: RootState) => state.cart.items
export const selectCartTotal = (state: RootState) => state.cart.items.reduce((sum, item) => sum + item.price, 0)
export const selectCartCount = (state: RootState) => state.cart.items.length
export const selectIsLoading = (state: RootState) => state.cart.isLoading

export default cartSlice.reducer
