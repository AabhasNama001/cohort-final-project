import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CartProvider } from "./contexts/CartContext";
import { OrderProvider } from "./contexts/OrderContext";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./components/HomePage"));
const ProductsPage = lazy(() => import("./components/ProductsPage"));
const ProductCreate = lazy(() => import("./components/ProductCreate"));
const CartPage = lazy(() => import("./components/CartPage"));
const AuthPage = lazy(() => import("./components/AuthPage"));
const OrdersPage = lazy(() => import("./components/OrdersPage"));
const PaymentPage = lazy(() => import("./components/PaymentPage"));
const NotificationsPage = lazy(() => import("./components/NotificationsPage"));
const SellerDashboardPage = lazy(() =>
  import("./components/SellerDashboardPage")
);
const AiBuddyPage = lazy(() => import("./components/AiBuddyPage"));

// Fallback UI while lazy-loaded components load
const Loader = () => (
  <div className="flex justify-center items-center min-h-[60vh] text-xl text-gray-600 animate-pulse">
    Loading...
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <div className="min-h-screen">
              <NavBar />

              <main className="max-w-6xl mx-auto py-8">
                <Suspense fallback={<Loader />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/ai-buddy" element={<AiBuddyPage />} />

                    {/* Protected User Routes */}
                    <Route
                      path="/cart"
                      element={
                        <ProtectedRoute roles={["user"]}>
                          <CartPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute roles={["user"]}>
                          <OrdersPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Protected Seller Routes */}
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute roles={["seller"]}>
                          <NotificationsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/seller"
                      element={
                        <ProtectedRoute roles={["seller"]}>
                          <SellerDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/create"
                      element={
                        <ProtectedRoute roles={["seller"]}>
                          <ProductCreate />
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch-all Route */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Suspense>
              </main>

              <Footer />
            </div>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
