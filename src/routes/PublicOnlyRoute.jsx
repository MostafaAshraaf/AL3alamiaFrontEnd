// routes/PublicOnlyRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user?.emailVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicOnlyRoute;