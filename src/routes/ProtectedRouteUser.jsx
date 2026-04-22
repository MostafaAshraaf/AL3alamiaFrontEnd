// ProtectedRouteUser.jsx (updated)
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRouteUser = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner" />
        <p>Loading user profile...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔐 NEW: Check email verification
  if (!user?.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Ensure user is client; admins should not access client routes
  if (!user || user.role !== "client") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteUser;
