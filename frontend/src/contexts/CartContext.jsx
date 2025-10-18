import React, { createContext, useState, useEffect, useContext } from 'react'
import * as cartService from '../services/cart.service'
import { AuthContext } from './AuthContext'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] })

  const loadCart = async () => {
    try {
      const data = await cartService.getCart()
      // cart.service.getCart returns the backend response which may include { cart, totals }
      if (!data) {
        setCart({ items: [] })
        return
      }
      if (data.cart) {
        setCart(data.cart || { items: [] })
        return
      }
      // fallback: if service already returned a cart-like object
      setCart(data || { items: [] })
    } catch (err) {
      setCart({ items: [] })
    }
  }

  const { loading: authLoading } = useContext(AuthContext)

  useEffect(() => {
    if (!authLoading) loadCart()
  }, [authLoading])

  const addItem = async (item) => {
    // item: { productId, qty, product? }
    try {
      await cartService.addToCart({ productId: item.productId, qty: item.qty })
      await loadCart()
      return { ok: true }
    } catch (err) {
      console.warn('addItem failed, using local fallback', err?.message)
      // fallback: add locally so UI shows immediate feedback for unauthenticated users
      try {
        setCart(prev => {
          const items = prev.items ? [...prev.items] : []
          const idx = items.findIndex(it => (it.productId || it.product?._id) === item.productId)
          if (idx >= 0) {
            items[idx] = { ...items[idx], quantity: (items[idx].quantity || items[idx].qty || 0) + (item.qty || 1) }
          } else {
            items.push({ productId: item.productId, quantity: item.qty || 1, product: item.product || null })
          }
          return { ...prev, items }
        })
        return { ok: true, fallback: true }
      } catch (e) {
        console.error('local fallback failed', e)
        return { ok: false, error: err }
      }
    }
  }

  const updateItem = async (itemId, data) => {
    try {
      await cartService.updateCartItem(itemId, data)
      await loadCart()
      return { ok: true }
    } catch (err) {
      console.error('updateItem error', err)
      return { ok: false, error: err }
    }
  }

  return (
    <CartContext.Provider value={{ cart, loadCart, addItem, updateItem }}>
      {children}
    </CartContext.Provider>
  )
}
