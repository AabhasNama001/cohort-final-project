import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import ProductCreate from "./ProductCreate";

export default function SellerDashboardPage() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const load = async () => {
    try {
      const res = await api.get("/seller/dashboard/products");
      setProducts(res.data?.data || res.data || []);
    } catch (err) {
      setProducts([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreated = async () => {
    setShowCreate(false);
    await load();
  };

  return (
    <div className="p-4 sm:p-8 bg-[#efefbf] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Seller Dashboard
          </h2>
          {user && (
            <div className="text-sm sm:text-base text-gray-600 mt-1">
              Seller: {user.username || user.email} — {user.email}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300"
        >
          Add Product
        </button>
      </div>

      {/* Product Creation Form */}
      {showCreate && (
        <div className="mb-6 p-4 border rounded-2xl bg-[#f5f5e0] shadow-md">
          <div className="flex justify-between items-center mb-3">
            <div className="font-semibold text-gray-700">
              Create New Product
            </div>
            <button
              onClick={() => setShowCreate(false)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
          <ProductCreate onDone={onCreated} />
        </div>
      )}

      {/* Products Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p._id}
            className="relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-blue-400 group"
          >
            {/* Product Image */}
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-gray-400">No Image</div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-4">
              <div className="font-semibold text-gray-800 text-lg truncate">
                {p.title}
              </div>
              <div className="text-sm sm:text-base text-gray-600 mt-1">
                {p.price?.amount} {p.price?.currency}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Stock: {p.stock ?? "N/A"}
              </div>
            </div>

            {/* Hover Overlay for Actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300">
                Edit
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
