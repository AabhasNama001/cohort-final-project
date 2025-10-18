import api from './api'

export async function getCart() {
  const res = await api.get('/cart')
  return res.data
}

export async function addToCart(item) {
  const res = await api.post('/cart/items', item)
  return res.data
}

export async function updateCartItem(itemId, data) {
  const res = await api.patch(`/cart/items/${itemId}`, data)
  return res.data
}
