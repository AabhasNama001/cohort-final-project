import React, { useContext, useState } from 'react'
import { CartContext } from '../contexts/CartContext'

export default function ProductDetail({ product, onClose }){
  const { addItem } = useContext(CartContext)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  if (!product) return null

  const handleAdd = async () => {
    setLoading(true)
    try {
      await addItem({ productId: product._id, qty: 1, product })
      setMessage('Added to cart')
    } catch (err) {
      setMessage('Failed to add to cart')
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 2500)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-full p-6 rounded shadow">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">{product.title}</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 flex items-center justify-center">
            <img src={product.images?.[0]?.url || 'https://via.placeholder.com/400'} alt="" className="max-h-80" />
          </div>
          <div>
            <p className="text-gray-700">{product.description}</p>
            <div className="mt-4 font-bold">{product.price?.amount} {product.price?.currency}</div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleAdd} disabled={loading} className="bg-green-600 disabled:opacity-60 text-white px-4 py-2 rounded">{loading? 'Adding...' : 'Add to cart'}</button>
              <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Close</button>
            </div>
            {message && <div className="mt-3 text-sm text-green-700">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
