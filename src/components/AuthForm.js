// src/components/AuthForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { toast } from "react-toastify";
import "../styles/auth.css";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";

const AuthForm = ({ isLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("✅ Logged in successfully!");
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match!");
          toast.error("❌ Passwords do not match!");
          setLoading(false);
          return;
        }
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        if (userCred.user) {
          await updateProfile(userCred.user, { displayName: name });
        }
        toast.success("🎉 Account created successfully!");
      }
      navigate("/");
    } catch (err) {
      const message = err.message || "Something went wrong!";
      setError(message);
      toast.error(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("📩 Password reset email sent!");
    } catch (err) {
      toast.error("❌ " + err.message);
    }
  };

  return (
    <div className="auth-page">
      {/* Branding Side (40%) */}
      <div className="auth-left">
        <h1 className="brand-title">NeuroZone</h1>
        <p className="brand-tagline">
          AI-Driven Shopping <br /> Smarter Than Ever 🚀
        </p>
        <div className="graphic"></div>
      </div>

      {/* Form Side (60%) */}
      <div className="auth-right">
        <div className="auth-card slide-in">
          <h2 className="auth-title">
            {isLogin ? "Welcome Back 👋" : "Create Your Account ✨"}
          </h2>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="auth-input-group">
                <FaUser className="auth-icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="auth-input-group">
              <FaEnvelope className="auth-icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <FaLock className="auth-icon" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div className="auth-input-group">
                <FaLock className="auth-icon" />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {isLogin && (
              <div className="auth-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />{" "}
                  Remember Me
                </label>
                <span className="forgot-pass" onClick={handleForgotPassword}>
                  Forgot Password?
                </span>
              </div>
            )}

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </button>

            {error && <p className="auth-error">{error}</p>}

            <p className="auth-switch">
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <span onClick={() => navigate("/signup")}>Sign Up</span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span onClick={() => navigate("/login")}>Log In</span>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
