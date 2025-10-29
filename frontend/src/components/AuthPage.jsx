import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { gsap } from "gsap";
import { Eye, EyeOff } from "lucide-react"; // for hide/show icons

export default function AuthPage() {
  const { login, register, logout, user } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const loginRef = useRef(null);
  const registerRef = useRef(null);
  const popupRef = useRef(null);

  // Animate transitions
  useEffect(() => {
    if (isRegister) {
      gsap.to(loginRef.current, {
        opacity: 0,
        x: -50,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(loginRef.current, { display: "none" });
          gsap.set(registerRef.current, { display: "block" });
          gsap.fromTo(
            registerRef.current,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 0.6, ease: "power2.inOut" }
          );
        },
      });
    } else {
      gsap.to(registerRef.current, {
        opacity: 0,
        x: 50,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(registerRef.current, { display: "none" });
          gsap.set(loginRef.current, { display: "block" });
          gsap.fromTo(
            loginRef.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.6, ease: "power2.inOut" }
          );
        },
      });
    }
  }, [isRegister]);

  // Animate popup open/close
  useEffect(() => {
    if (showLogoutPopup) {
      gsap.fromTo(
        popupRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [showLogoutPopup]);

  const validateLogin = () => {
    if (!email || !password) {
      alert("Please fill in all login fields.");
      return false;
    }
    return true;
  };

  const validateRegister = () => {
    if (!username || !firstName || !lastName || !email || !password) {
      alert("Please fill in all registration fields.");
      return false;
    }
    return true;
  };

  const doLogin = async () => {
    if (!validateLogin()) return;
    try {
      await login({ email, password, role });
      alert("Logged in successfully!");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const doRegister = async () => {
    if (!validateRegister()) return;
    try {
      await register({
        username,
        email,
        password,
        fullName: { firstName, lastName },
        role,
      });
      alert("Registered and logged in!");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") action();
  };

  return (
    <div className="h-[80vh] md:h-[90vh] flex items-center justify-center px-4 relative">
      {/* LOGOUT POPUP */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div
            ref={popupRef}
            className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm text-center border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to log out?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  logout();
                  setShowLogoutPopup(false);
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-md"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CARD */}
      {user ? (
        <div className="p-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md text-center border border-white/40">
          <h2 className="text-3xl font-bold mb-2 text-indigo-700">
            Welcome ✨
          </h2>
          <p className="text-gray-700 font-medium">
            {user.username || user.email}
          </p>
          <p className="text-sm text-gray-500 mb-6">Role: {user.role}</p>
          <button
            onClick={() => setShowLogoutPopup(true)}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 text-white px-6 py-2 rounded-xl font-semibold shadow-md transition-all"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40">
          {/* LOGIN CARD */}
          <div ref={loginRef} className="p-8">
            <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
              Welcome Back 👋
            </h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, doLogin)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <div className="relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, doLogin)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full pr-10 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="user">Customer</option>
              <option value="seller">Seller</option>
            </select>
            <button
              onClick={doLogin}
              className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:opacity-90 text-white w-full py-2 rounded-lg font-semibold transition-all shadow-md"
            >
              Login
            </button>
            <p className="text-center text-gray-500 mt-4 text-sm">
              Don’t have an account?{" "}
              <button
                onClick={() => setIsRegister(true)}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Register
              </button>
            </p>
          </div>

          {/* REGISTER CARD */}
          <div ref={registerRef} className="p-8 hidden">
            <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
              Create Account ✨
            </h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, doRegister)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, doRegister)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, doRegister)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, doRegister)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mt-3 mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, doRegister)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full pr-10 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              onClick={doRegister}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white w-full py-2 rounded-lg font-semibold transition-all shadow-md"
            >
              Register
            </button>
            <p className="text-center text-gray-500 mt-4 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => setIsRegister(false)}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
