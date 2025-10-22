// src/components/SellerDashboardPage.jsx

import React, { useEffect, useState, useContext } from "react";

// THE FIX 1: Import the new service file
import * as sellerService from "../services/seller.service";

import { AuthContext } from "../contexts/AuthContext";
import ProductCreate from "./ProductCreate"; // This was in your error log

// A simple component to render the dashboard
export default function SellerDashboardPage() {
  const { user } = useContext(AuthContext);

  // State for all 3 data points
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // THE FIX 2: Use the new service in useEffect
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch all data in parallel
        const [metricsData, ordersData, productsData] = await Promise.all([
          sellerService.getSellerMetrics(),
          sellerService.getSellerOrders(),
          sellerService.getSellerProducts(),
        ]);

        // Set state from the data
        setMetrics(metricsData);
        setOrders(ordersData.orders || ordersData || []); // Handle if API returns {orders: []} or just []
        setProducts(productsData.products || productsData || []); // Handle if API returns {products: []} or just []
      } catch (err) {
        console.error("Failed to load seller dashboard:", err);
        setError("Could not load your data.");
      } finally {
        setLoading(false);
      }
    };

    // Only run if the user is a seller
    if (user?.role === "seller") {
      loadData();
    } else {
      setLoading(false);
      setError("You do not have permission to view this page.");
    }
  }, [user]); // Reload if the user changes

  // Handler for when a new product is created (to refresh the list)
  const onProductCreated = (newProduct) => {
    setProducts((currentProducts) => [newProduct, ...currentProducts]);
  };

  // Render logic
  if (loading) return <div className="p-6">Loading your dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (user?.role !== "seller") return <div className="p-6">Unauthorized.</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

      {/* Section 1: Metrics */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Metrics</h2>
        {metrics ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(metrics, null, 2)}
          </pre>
        ) : (
          <p>No metrics available.</p>
        )}
      </section>

      {/* Section 2: Create Product */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Create New Product</h2>
        <ProductCreate onProductCreated={onProductCreated} />
      </section>

      {/* Section 3: My Products */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          My Products ({products.length})
        </h2>
        <div className="bg-white p-4 rounded shadow">
          <ul className="divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((product) => (
                <li
                  key={product._id}
                  className="py-3 flex justify-between items-center"
                >
                  <span>{product.name}</span>
                  <span className="font-medium">${product.price}</span>
                </li>
              ))
            ) : (
              <p>You have not created any products yet.</p>
            )}
          </ul>
        </div>
      </section>

      {/* Section 4: My Orders */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Orders to Fulfill ({orders.length})
        </h2>
        <div className="bg-white p-4 rounded shadow">
          <ul className="divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => (
                <li
                  key={order._id}
                  className="py-3 flex justify-between items-center"
                >
                  <span>Order ID: {order._id}</span>
                  <span className="capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {order.status}
                  </span>
                </li>
              ))
            ) : (
              <p>No orders to fulfill.</p>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
