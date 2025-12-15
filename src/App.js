import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import SearchResults from "./pages/SearchResults";
import ProductDetails from "./pages/ProductDetails";
import GlassesList from "./pages/GlassesList";
import TryOnLive from "./pages/TryOnLive";
import ProductList from "./pages/ProductList";
import TryOn from "./pages/TryOn";
import TryOnClothesDetails from "./pages/TryOnClothesDetails";
import TryOnClothesLive from "./pages/TryOnClothesLive";
import TryOnClothesList from "./pages/TryOnClothesList";
import TryOnWatch from "./pages/TryOnWatch";
import TryOnWatchList from "./pages/TryOnWatchList";
import TryOnWatchLive from "./pages/TryOnWatchLive";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/globals.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import OrdersPage from "./pages/OrdersPage";
import GamesPage from "./pages/GamesPage";
import MyCouponsPage from "./pages/MyCouponsPage";
import SpinWheel from "./pages/games/SpinWheel";
import ScratchCard from "./pages/games/ScratchCard";
import QuizGame from "./pages/games/QuizGame";
import ChatBot from "./pages/ChatBot"; 

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <AuthProvider>
        <Router>
          <CartProvider>
          <Navbar user={user} />
          <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<ProtectedRoute><GamesPage /></ProtectedRoute>} />
            <Route path="/games/spinwheel" element={<SpinWheel userId={user?.uid} />} />
            <Route path="/games/scratchcard" element={<ScratchCard userId={user?.uid} />} />
            <Route path="/games/quiz" element={<QuizGame userId={user?.uid} />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chatbot" element={<ProtectedRoute><ChatBot /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />

            <Route path="/tryon/watches" element={<ProtectedRoute><TryOnWatchList /></ProtectedRoute>} />
            <Route path="/tryon/watches/live" element={<ProtectedRoute><TryOnWatchLive /></ProtectedRoute>} />
            <Route path="/tryon/watch" element={<TryOnWatch />} />
            <Route path="/tryon/watches/live" element={<ProtectedRoute><TryOnWatchLiveWrapper /></ProtectedRoute>}/>

            <Route
              path="/glasses"
              element={
                <ProtectedRoute>
                  <GlassesList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/games"
              element={
                <ProtectedRoute>
                  <GamesPage />
                </ProtectedRoute>
              }
            />

            <Route path="/my-coupons" element={<ProtectedRoute><MyCouponsPage /></ProtectedRoute>} />

            <Route
              path="/tryon"
              element={
                <ProtectedRoute>
                  <TryOn />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />

            <Route path="/orders" element={<OrdersPage />} />

            <Route
              path="/tryon/live"
              element={
                <ProtectedRoute>
                  <TryOnLiveWrapper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tryon/products"
              element={
                <ProtectedRoute>
                  <ProductList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tryon/clothes"
              element={
                <ProtectedRoute>
                  <TryOnClothesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tryon/clothes/:id"
              element={
                <ProtectedRoute>
                  <TryOnClothesDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tryon/clothes/live"
              element={
                <ProtectedRoute>
                  <TryOnClothesLive />
                </ProtectedRoute>
              }
            />

            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <ProductDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchResults />
                </ProtectedRoute>
              }
            />

            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          </CartProvider>
        </Router>
        <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

const TryOnLiveWrapper = () => {
  const location = useLocation();
  const { glass } = location.state || {};
  if (!glass)
    return (
      <p style={{ padding: 24 }}>
        No glasses selected. <a href="/glasses">Go to Glasses List</a>
      </p>
    );
  return <TryOnLive glassesSrc={glass.images[0]} />;
};

const TryOnWatchLiveWrapper = () => {
  const location = useLocation();
  const { watch } = location.state || {};
  if (!watch)
    return (
      <p style={{ padding: 24 }}>
        No watch selected. <a href="/tryon/watches">Go to Watch List</a>
      </p>
    );
  return <TryOnWatch selectedWatch={watch.image} />;
};

const NotFound = () => (
  <div style={{ padding: 24 }}>
    <h2>Page not found</h2>
    <p>
      The page you requested doesn't exist. <a href="/">Go to Home</a>
    </p>
  </div>
);

export default App;
