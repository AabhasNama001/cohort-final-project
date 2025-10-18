import api from './api'

export async function fetchProducts(params = {}) {
  const res = await api.get('/products', { params })
  return res.data
}

export async function fetchProductById(id) {
  const res = await api.get(`/products/${id}`)
  return res.data
}

export async function createProduct(formData) {
  const res = await api.post('/products', formData)
  return res.data
}
