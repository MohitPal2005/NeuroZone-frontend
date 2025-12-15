import React, { useState, useRef, useEffect } from "react";
import {
  FaMicrophone,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import Logo from "../assets/neurozone-logo.png";
import TryOnIcon from "../assets/tryon.png";
import ChatBotIcon from "../assets/chatbot.png";
import { MdSportsEsports } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import "../components/Navbar.css";
import VoiceOverlay from "../pages/VoiceOverlay";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cart } = useCart();
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("darkMode", JSON.stringify(newTheme));
  };

  const [user, setUser] = useState(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const startListening = () => {
    setError(null);
    setTranscript("");
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice search not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setQuery(text);
      setTranscript(text);
      navigate(`/search?q=${encodeURIComponent(text)}`);
      setListening(false);
      setShowOverlay(false);
    };

    recognition.onerror = (event) => {
      if (event.error !== "aborted") setError(event.error);
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setShowOverlay(true);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {showOverlay && (
        <VoiceOverlay
          listening={listening}
          transcript={transcript}
          error={error}
          onClose={() => {
            if (recognitionRef.current) recognitionRef.current.stop();
            setListening(false);
            setShowOverlay(false);
          }}
        />
      )}

      <div className="navbar__left" onClick={() => navigate("/")}>
        <img src={Logo} alt="NeuroZone Logo" className="logo-image" />
        <span className="logo-text">NeuroZone</span>
      </div>

      <div className="navbar__center">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <button
            onClick={startListening}
            className={`mic-button ${listening ? "listening" : ""}`}
          >
            <FaMicrophone
              className="mic-icon"
              color={listening ? "white" : "#bbbbbb"}
            />
          </button>
        </div>
      </div>

      <div className="navbar__right">
        {!user ? (
          <span onClick={() => navigate("/login")} className="nav-item">
            Login
          </span>
        ) : (
          <span onClick={handleLogout} className="nav-item">
            Logout
          </span>
        )}

        <Link to="/orders" className="nav-item">
          Orders
        </Link>

        <Link to="/my-coupons" className="nav-item">
          Coupons
        </Link>

        <div className="nav-icon cart-wrapper" onClick={() => navigate("/cart")}>
          <ShoppingCart size={26} className="cart-icon" />
          {cart.length > 0 && (
            <span className="cart-badge">
              {cart.reduce((a, i) => a + i.quantity, 0)}
            </span>
          )}
        </div>

        <img src={TryOnIcon} alt="Try On" className="nav-tryon-icon" onClick={() => navigate("/tryon")}/>
        <img src={ChatBotIcon} alt="ChatBot" className="nav-chatbot-icon" onClick={() => navigate("/chatbot")}/>
        <MdSportsEsports size={36} className="nav-icon" onClick={() => navigate("/games")}/>
        <FiMessageSquare size={28} className="nav-icon" onClick={() => navigate("/contact")}/>

        <div id="theme-toggle" onClick={toggleTheme} className="nav-icon">
          {darkMode ? <FaSun /> : <FaMoon />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
