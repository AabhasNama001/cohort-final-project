import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const navigate = useNavigate();
const HomeHandler = () => {
  navigate("/");
};

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-10 pb-6">
      <div className="max-w-6xl mx-auto px-6 md:px-0 flex flex-col md:flex-row justify-between gap-10 md:gap-0">
        {/* Logo */}
        <div className="flex flex-col items-start md:items-start">
          <h1
            onClick={HomeHandler}
            className="text-2xl cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text font-bold mb-4"
          >
            ShopEase
          </h1>
          <p className="text-gray-400 max-w-xs">
            Your go-to store for handpicked products and exclusive deals.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row gap-10">
          <div>
            <h3 className="font-semibold text-white mb-3">Navigate</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-pink-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-pink-500 transition">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/ai-buddy" className="hover:text-pink-500 transition">
                  AI Buddy
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy Links */}
          <div>
            <h3 className="font-semibold text-white mb-3">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="hover:text-pink-500 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-pink-500 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-pink-500 transition">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-white mb-3">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} ShopEase. Built with ❤️ by Abhi.
      </div>
    </footer>
  );
}
