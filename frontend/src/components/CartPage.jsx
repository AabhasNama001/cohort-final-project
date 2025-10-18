import React, { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import * as orderService from "../services/order.service";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, loadCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.street) e.street = "Street is required";
    if (!form.city) e.city = "City is required";
    if (!form.state) e.state = "State is required";
    if (!form.pincode || !/^\d{4,}$/.test(form.pincode))
      e.pincode = "Pincode must be at least 4 digits";
    if (!form.country) e.country = "Country is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // Send full payload required by backend
      const payload = {
        shippingAddress: { ...form },
      };
      await orderService.createOrder(payload);
      alert("✅ Order placed successfully!");
      setShowCheckout(false);
      setForm({ street: "", city: "", state: "", pincode: "", country: "" });
      await loadCart();
      navigate("/orders");
    } catch (err) {
      console.error("Checkout error:", err);
      alert(
        "Checkout failed: " + (err?.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#efefbf] p-8">
      <div className="max-w-4xl mx-auto bg-[#f5f5dd] backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
          🛒 Your Shopping Cart
        </h2>

        {cart.items && cart.items.length ? (
          <>
            <ul className="divide-y divide-gray-200">
              {cart.items.map((i, idx) => (
                <li
                  key={i._id || idx}
                  className="py-4 px-4 flex justify-between items-center hover:bg-gray-50/70 rounded-xl transition-all duration-300"
                >
                  <div>
                    <div className="font-semibold text-gray-900">
                      {i.product?.title || i.productId}
                    </div>
                    <div className="text-sm text-gray-500">
                      Qty: {i.quantity ?? i.qty ?? 1}
                    </div>
                  </div>
                  <div className="font-semibold text-indigo-600">
                    {i.product?.price?.amount ?? "-"}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={loadCart}
                className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
              >
                Refresh
              </button>
              <button
                onClick={() => setShowCheckout(true)}
                className="px-6 py-2 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-500 text-lg">
            🕓 Your cart is empty. Start adding some awesome products!
          </div>
        )}
      </div>

      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative animate-fadeInUp">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Shipping Address
            </h3>

            <div className="space-y-3">
              {["street", "city", "state", "pincode", "country"].map(
                (field) => (
                  <div key={field}>
                    <input
                      value={form[field]}
                      onChange={(e) =>
                        setForm({ ...form, [field]: e.target.value })
                      }
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      className="w-full p-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none transition"
                    />
                    {errors[field] && (
                      <div className="text-red-600 text-sm mt-1">
                        {errors[field]}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={submitOrder}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow hover:shadow-lg disabled:opacity-60 transition-all"
              >
                {loading ? "Placing..." : "Place Order"}
              </button>
            </div>

            <div className="absolute inset-0 rounded-3xl border border-transparent hover:border-indigo-400/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 pointer-events-none"></div>
          </div>

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
            .animate-fadeInUp {
              animation: fadeInUp 0.4s ease both;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
