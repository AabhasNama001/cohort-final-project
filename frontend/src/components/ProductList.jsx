import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "../contexts/ProductContext";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";

export default function ProductList() {
  const { products, loading, loadProducts } = useContext(ProductContext);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const doSearch = async () => {
    loadProducts({ q: query });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-xl text-gray-600 animate-pulse">
        Loading products...
      </div>
    );

  return (
    <div className="p-6 sm:p-10 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl text-white mb-10">
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 py-12 px-6">
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold drop-shadow-md">
              Discover Premium Products
            </h1>
            <p className="mt-3 text-lg opacity-90">
              Handpicked items from top sellers — find your next favorite item,
              fast and easy.
            </p>
          </div>

          <div className="w-full md:w-[380px] bg-white/20 backdrop-blur-md rounded-2xl p-3 shadow-lg">
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search amazing products..."
                className="w-full p-3 rounded-xl bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-pink-400 outline-none transition"
              />
              <button
                onClick={doSearch}
                className="px-5 py-2 bg-white text-indigo-600 rounded-xl font-semibold shadow hover:scale-105 transition-transform"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* No Results */}
      {products.length === 0 && (
        <div className="p-16 text-center text-gray-500 text-lg">
          <p className="animate-pulse">
            No products found. Try adjusting your search terms.
          </p>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 transition-all duration-500">
        {products.map((p, i) => (
          <div
            key={p._id}
            className="animate-fadeInUp"
            style={{
              animationDelay: `${i * 0.08}s`,
              animation: "fadeInUp 0.5s ease both",
            }}
          >
            <ProductCard product={p} onView={setSelected} />
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <ProductDetail product={selected} onClose={() => setSelected(null)} />

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
