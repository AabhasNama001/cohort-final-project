import React, { useContext, useState, useEffect, useRef } from "react";
import { ProductContext } from "../contexts/ProductContext";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const { products, loading, loadProducts } = useContext(ProductContext);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const categoryRefs = useRef([]);
  const bannerRef = useRef(null);
  const collageRefs = useRef([]);
  const testimonialRefs = useRef([]);

  useEffect(() => {
    loadProducts();
  }, []);

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
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        }
      );
    });

    // Animate featured banner
    if (bannerRef.current) {
      const img = bannerRef.current.querySelector("img");
      const overlay = bannerRef.current.querySelector("div");

      gsap.to(img, { opacity: 1, duration: 1.2, ease: "power2.out" });
      gsap.to(overlay, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.3,
      });
      gsap.fromTo(
        img,
        { filter: "brightness(1)" },
        {
          filter: "brightness(1.2)",
          duration: 1,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
          delay: 0.3,
        }
      );
    }

    // Animate photo collage
    collageRefs.current.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    });

    // Animate testimonials
    testimonialRefs.current.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    });
  }, [products]);

  const doSearch = async () => {
    loadProducts({ q: query });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-xl text-gray-600 animate-pulse">
        Loading products...
      </div>
    );

  const RedirectToProductsPage = () => {
    navigate("/products");
  };

  return (
    <div className="min-h-screen p-6 sm:p-10">
      {/* ---------------- BANNER ---------------- */}
      <section
        className="relative mb-16 max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-xl"
        ref={bannerRef}
      >
        <img
          src="https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=60&w=1200"
          alt="Featured"
          className="w-full h-[300px] object-cover opacity-0"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-6 opacity-0">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Welcome to ShopEase
          </h2>
          <p className="max-w-md text-gray-200 mb-5">
            Discover the best deals on trending products. Your next favorite
            item is just a click away!
          </p>
          <button onClick={RedirectToProductsPage} className="bg-white text-indigo-700 font-semibold px-6 py-2 rounded-xl shadow hover:scale-105 transition-transform">
            Shop Now
          </button>
        </div>
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Explore by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            {
              name: "T-shirt",
              image:
                "https://plus.unsplash.com/premium_photo-1718913936342-eaafff98834b?auto=format&fit=crop&q=60&w=600",
            },
            {
              name: "Jackets",
              image:
                "https://plus.unsplash.com/premium_photo-1760179325525-ec3edff26677?auto=format&fit=crop&q=60&w=600",
            },
            {
              name: "Shoes",
              image:
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=60&w=600",
            },
            {
              name: "Bags",
              image:
                "https://plus.unsplash.com/premium_photo-1678739395192-bfdd13322d34?auto=format&fit=crop&q=60&w=600",
            },
            {
              name: "Jeans",
              image:
                "https://images.unsplash.com/photo-1714729382668-7bc3bb261662?auto=format&fit=crop&q=60&w=600",
            },
            {
              name: "Shirt",
              image:
                "https://images.unsplash.com/photo-1687275160744-ef140bf5529c?auto=format&fit=crop&q=60&w=600",
            },
          ].map((cat, i) => (
            <div
              key={cat.name}
              onClick={RedirectToProductsPage}
              ref={(el) => (categoryRefs.current[i] = el)}
              className="group relative bg-gradient-to-br from-white to-gray-100 border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 flex flex-col justify-center items-center"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-16 h-16 rounded-full mb-3 object-cover"
              />
              <h3 className="font-semibold text-gray-700 group-hover:text-indigo-600">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- MARQUEE ---------------- */}
      <div className="overflow-hidden w-full bg-transparent py-20">
        <div className="marquee">
          <div className="track">
            <span className="text-4xl md:text-6xl font-serif mx-8">
              SHOPEASE ✧ SHOPEASE ✧ SHOPEASE ✧ SHOPEASE ✧ SHOPEASE ✧ SHOPEASE ✧
            </span>
            <span className="text-4xl md:text-6xl font-serif mx-8">
              SHOPEASE ✧ SHOPEASE ✧ SHOPEASE ✧ SHOPEASE ✧ SHOPEASE ✧ SHOPEASE ✧
            </span>
          </div>
        </div>
      </div>

      {/* ---------------- PRODUCT GRID ---------------- */}
      {products.length === 0 ? (
        <div className="p-16 text-center text-gray-500 text-lg">
          <p className="animate-pulse">
            No products found. Try adjusting your search terms.
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Latest Arrivals
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 transition-all duration-500">
            {products
              .sort(() => Math.random() - 0.5)
              .slice(0, 4)
              .map((p, i) => (
                <div
                  key={p._id}
                  style={{
                    animationDelay: `${i * 0.08}s`,
                    animation: "fadeInUp 0.5s ease both",
                  }}
                >
                  <ProductCard product={p} onView={setSelected} />
                </div>
              ))}
          </div>
        </>
      )}

      {/* ---------------- PHOTO COLLAGE SECTION ---------------- */}
      <section className="max-w-6xl mx-auto my-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          A Glimpse of Our World
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative">
          {[
            "https://ik.imagekit.io/aabhas/products/pexels-rachel-claire-5490917.jpg?updatedAt=1761647459144",
            "https://ik.imagekit.io/aabhas/products/Gemini_Generated_Image_idkxsxidkxsxidkx.png?updatedAt=1761647329680",
            "https://ik.imagekit.io/aabhas/products/pexels-mart-production-7679442.jpg?updatedAt=1761647958332",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=60&w=800",
          ].map((src, i) => (
            <div
              key={i}
              ref={(el) => (collageRefs.current[i] = el)}
              className={`overflow-hidden rounded-2xl shadow-lg transform hover:scale-105 transition-transform ${
                i === 1 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <img
                src={src}
                alt={`Collage ${i + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="max-w-6xl mx-auto my-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          What Our Customers Say
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Aarav Sharma",
              review: "Amazing quality and fast delivery! Highly recommended.",
            },
            {
              name: "Neha Kapoor",
              review:
                "The product was even better than expected. Love this platform!",
            },
            {
              name: "Rohan Mehta",
              review: "Great experience overall, from browsing to checkout.",
            },
          ].map((t, i) => (
            <div
              key={i}
              ref={(el) => (testimonialRefs.current[i] = el)}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:-translate-y-1 hover:shadow-2xl transition-all"
            >
              <p className="text-gray-600 italic mb-4">“{t.review}”</p>
              <h4 className="font-semibold text-gray-800">— {t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- NEWSLETTER ---------------- */}
      <section className="relative bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-3xl py-14 px-6 text-center mb-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-3">Join Our Newsletter</h2>
        <p className="opacity-90 mb-6">
          Get updates on new arrivals, exclusive deals, and exciting offers.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-xl text-gray-800 w-full outline-none"
          />
          <button className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl shadow hover:scale-105 transition-transform">
            Subscribe
          </button>
        </div>
      </section>

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

      {/* ---------------- PRODUCT MODAL ---------------- */}
      <ProductDetail product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
