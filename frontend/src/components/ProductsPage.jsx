import React, { useContext, useState, useEffect, useRef } from "react";
import { ProductContext } from "../contexts/ProductContext";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProductsPage() {
  const { products, loading, loadProducts } = useContext(ProductContext);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const categoryRefs = useRef([]);
  const trendingRef = useRef(null);
  const limitedRef = useRef(null);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // GSAP Animations
  useEffect(() => {
    // Animate categories
    categoryRefs.current.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          delay: i * 0.1,
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
    });

    // Animate trending section
    if (trendingRef.current) {
      gsap.fromTo(
        trendingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: { trigger: trendingRef.current, start: "top 80%" },
        }
      );
    }

    // Animate limited offers
    if (limitedRef.current) {
      gsap.fromTo(
        limitedRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: { trigger: limitedRef.current, start: "top 80%" },
        }
      );
    }
  }, [products]);

  // Search products
  const doSearch = async () => {
    loadProducts({ q: query });
  };

  // Dynamic Countdown Timer
  useEffect(() => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);

    const interval = setInterval(() => {
      const now = new Date();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-xl text-gray-600 animate-pulse">
        Loading products...
      </div>
    );

  return (
    <div className="bg-[#ffe5bd] rounded-lg border-2 border-red-900 text-gray-100 min-h-screen p-6 sm:p-10">
      {/* ---------------- HERO / Browse Products ---------------- */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl text-white mb-12">
        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 py-12 px-6">
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold drop-shadow-md">
              Browse Our Products
            </h1>
            <p className="mt-3 text-lg opacity-90">
              Explore a wide range of products handpicked for you.
            </p>
          </div>
          <div className="w-full md:w-[380px] bg-white/20 backdrop-blur-md rounded-2xl p-3 shadow-lg">
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
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
      </section>

      {/* ---------------- ALL PRODUCTS ---------------- */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">
          All Products
        </h2>
        {products.length === 0 ? (
          <p className="text-center text-gray-400">No products found.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
        )}
      </section>

      {/* ---------------- FEATURED CATEGORIES (NEON STYLE) ---------------- */}
      <section className="mb-16 max-w-6xl mx-auto" ref={trendingRef}>
        <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">
          Featured Categories
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            { name: "Men's", color: "from-pink-500 to-purple-600" },
            { name: "Women's", color: "from-indigo-500 to-pink-500" },
            { name: "Kids", color: "from-green-400 to-blue-500" },
            { name: "Footwear", color: "from-yellow-400 to-orange-500" },
          ].map((cat) => (
            <div
              key={cat.name}
              className={`bg-gradient-to-r ${cat.color} p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform text-center cursor-pointer`}
            >
              <h3 className="font-bold text-lg text-white">{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- LIMITED TIME OFFERS ---------------- */}
      <section
        ref={limitedRef}
        className="mb-16 max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 text-center text-white shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-3">Limited Time Offers</h2>
        <p className="opacity-90 mb-6">
          Grab these exclusive deals before they are gone! Countdown begins now.
        </p>
        <div className="text-4xl font-mono mb-6 animate-pulse">
          {`${String(timeLeft.hours).padStart(2, "0")} : ${String(
            timeLeft.minutes
          ).padStart(2, "0")} : ${String(timeLeft.seconds).padStart(2, "0")}`}
        </div>
        <button className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl shadow hover:scale-105 transition-transform">
          Shop Now
        </button>
      </section>

      {/* ---------------- AI Recommendations ---------------- */}
      <section className="mb-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">
          Recommended for You
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p._id} product={p} onView={setSelected} />
          ))}
        </div>
      </section>

      {/* ---------------- PRODUCT MODAL ---------------- */}
      <ProductDetail product={selected} onClose={() => setSelected(null)} />

      {/* ---------------- ANIMATION KEYFRAMES ---------------- */}
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
