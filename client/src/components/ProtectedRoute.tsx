import React from "react";
import { useLocation, Redirect } from "wouter";
import { useAuth } from "@/hooks/useAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireRole?: string | string[]; // single role or array of allowed roles
  fallbackPath?: string; // where to redirect if not allowed
};

export default function ProtectedRoute({ children, requireRole, fallbackPath = "/admin-login" }: ProtectedRouteProps) {
  const [location, setLocation] = useLocation();
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  const userType = auth.data?.userType || null;

  // Not authenticated
  if (!userType) {
    setLocation(fallbackPath);
    return null;
  }

  if (requireRole) {
    const allowed = Array.isArray(requireRole) ? requireRole : [requireRole];
    if (!allowed.includes(userType)) {
      // Redirect to fallback or home
      setLocation("/");
      return null;
    }
  }

  return <>{children}</>;
}
