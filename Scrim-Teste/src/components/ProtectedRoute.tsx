import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Redireciona para login se não estiver logado
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
