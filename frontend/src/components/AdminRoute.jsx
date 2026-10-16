import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await api.get("/auth/me");

        setIsAdmin(response.data.is_admin);
      } catch (error) {
        console.error(error);

        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return <p>Checking access...</p>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;