import React, { createContext, useEffect, useState } from 'react'
import * as productService from '../services/product.service'

export const ProductContext = createContext()

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const loadProducts = async (params) => {
    setLoading(true)
    try {
      const res = await productService.fetchProducts(params)
      setProducts(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <ProductContext.Provider value={{ products, loading, loadProducts }}>
      {children}
    </ProductContext.Provider>
  )
}
