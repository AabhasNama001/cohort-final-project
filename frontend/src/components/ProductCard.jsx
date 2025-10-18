import React, { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";

export default function ProductCard({ product, onView }) {
  const { addItem } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleAdd = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await addItem({ productId: product._id, qty: 1, product });
      if (res && res.ok) setMsg("Added");
      else setMsg("Failed");
    } catch (err) {
      setMsg("Failed");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(null), 1800);
    }
  };

  return (
    <div
      onClick={() => onView && onView(product)}
      className="group relative cursor-pointer bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={product.images?.[0]?.url || "https://via.placeholder.com/300"}
          alt={product.title}
          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView && onView(product);
          }}
          className="absolute bottom-3 right-3 text-xs font-semibold bg-white/90 text-gray-800 rounded-lg px-3 py-1 shadow hover:bg-indigo-600 hover:text-white transition-colors"
        >
          View
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h4 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
          {product.title}
        </h4>
        <p className="text-sm text-gray-500 mt-2 line-clamp-3">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="font-extrabold text-gray-900 text-base">
            {product.price?.amount} {product.price?.currency}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="px-4 py-1.5 text-sm font-medium rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? "..." : "Add"}
            </button>
            {msg && (
              <span
                className={`text-xs font-medium ${
                  msg === "Added" ? "text-green-600" : "text-red-500"
                }`}
              >
                {msg}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Glow hover border */}
      <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-indigo-400/60 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-500 pointer-events-none"></div>
    </div>
  );
}
