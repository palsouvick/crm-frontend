import { Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <AppLayout /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
