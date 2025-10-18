import React, { useContext, useEffect } from "react";
import { OrderContext } from "../contexts/OrderContext";

export default function OrdersPage() {
  const { orders, loadOrders } = useContext(OrderContext);

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="p-4 sm:p-8 bg-[#efefbf] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
          📦 My Orders
        </h2>

        {orders.length === 0 ? (
          <div className="text-gray-500 text-center py-20 text-lg sm:text-xl">
            You have no orders yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((o) => (
              <div
                key={o._id}
                className="relative p-5 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-white shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-transparent bg-origin-border hover:border-gradient-to-r hover:border-purple-500"
              >
                {/* Animated Gradient Status Badge */}
                <div className="flex justify-between items-center mb-3">
                  <div className="font-semibold text-gray-700 text-sm sm:text-base truncate">
                    Order #{o._id}
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full animate-pulse ${
                      o.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : o.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {o.status}
                  </span>
                </div>

                {/* Card Content */}
                <div className="text-gray-600 text-sm sm:text-base space-y-2">
                  <div>
                    <span className="font-medium">Items:</span>{" "}
                    {o.items?.length || 0}
                  </div>
                  <div>
                    <span className="font-medium">Total:</span>{" "}
                    {o.totalPrice?.amount ?? "-"} {o.totalPrice?.currency ?? ""}
                  </div>
                  <div className="text-xs text-gray-400">
                    Placed: {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
