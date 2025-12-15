import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    toast.info("🔒 Please login or sign up to access this feature!");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
