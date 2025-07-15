import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, roles = [] }) {
  const location = useLocation();
  const reduxUser = useSelector((state) => state.auth.user);

  // Fallback to localStorage if Redux state is empty (after refresh)
  const storedUser = localStorage.getItem("user");
  const user = reduxUser || (storedUser && JSON.parse(storedUser));

  // No user -> redirect to login page
  if (!user) {
    return (
      <Navigate
        to={`/login?role=${roles[0] || "patient"}`}
        state={{ from: location }}
        replace
      />
    );
  }

  // If role mismatch -> redirect to unauthorized
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Everything good → render child route
  return children;
}
