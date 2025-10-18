import React, { createContext, useState } from 'react'
import * as orderService from '../services/order.service'

export const OrderContext = createContext()

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([])

  const loadOrders = async () => {
    try {
      const res = await orderService.getMyOrders()
      // backend returns { orders, meta }
      setOrders(res.orders || [])
    } catch (err) {
      // if 401, leave orders as empty and allow UI to show login prompt
      setOrders([])
    }
  }

  return (
    <OrderContext.Provider value={{ orders, loadOrders }}>
      {children}
    </OrderContext.Provider>
  )
}
