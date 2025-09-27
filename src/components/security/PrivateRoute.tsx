    // src/components/security/PrivateRoute.tsx
    import React from "react";
    import { Navigate, useLocation } from "react-router-dom";

    const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
    const location = useLocation();

   if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
    };

    export default PrivateRoute;
