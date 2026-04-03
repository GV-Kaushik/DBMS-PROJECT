import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, correctRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) {
    return <Navigate to="/" />;
  }
 if (correctRole && role !== correctRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
