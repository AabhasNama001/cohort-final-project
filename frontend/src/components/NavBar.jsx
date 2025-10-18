import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);

  // Close mobile menu on window resize beyond md breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen]);

  const links = [
    { to: "/", label: "Home", show: true },
    { to: "/products", label: "Products", show: true },
    { to: "/cart", label: "Cart", show: user?.role !== "seller" },
    { to: "/orders", label: "Orders", show: user?.role !== "seller" },
    { to: "/seller", label: "Seller", show: user?.role === "seller" },
    {
      to: "/notifications",
      label: "Notifications",
      show: user?.role === "seller",
    },
    { to: "/ai-buddy", label: "AI", show: true },
  ];

  return (
    <header className="bg-[#000000] shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text hover:scale-105 transition-transform"
        >
          ShopEase
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {links
            .filter((link) => link.show)
            .map((link) => (
              <AnimatedLink key={link.to} to={link.to}>
                {link.label}
              </AnimatedLink>
            ))}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-white truncate max-w-[120px]">
                {user.username || user.email}
              </span>
              <button
                onClick={logout}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-all duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-all duration-200"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-2xl text-gray-700 z-50"
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu with sliding animation */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <nav className="flex flex-col gap-3 px-6 py-6">
          {links
            .filter((link) => link.show)
            .map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 font-medium py-2 px-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

          {user ? (
            <div className="flex flex-col gap-2 mt-4">
              <span className="text-sm text-gray-600 truncate max-w-[150px]">
                {user.username || user.email}
              </span>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-all duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-all duration-200 mt-4"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          onClick={toggleMobileMenu}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30 transition-opacity"
        />
      )}
    </header>
  );
}

/* 🔹 Reusable NavLink component with hover underline animation */
function AnimatedLink({ to, children }) {
  return (
    <Link
      to={to}
      className="
        relative text-gray-100 font-medium
        after:content-[''] after:absolute after:left-0 after:bottom-[-4px]
        after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-500 after:to-purple-600
        after:transition-all after:duration-300 hover:after:w-full
        hover:text-blue-600 transition-colors duration-300
      "
    >
      {children}
    </Link>
  );
}
