import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const checkAdmin = async () => {
      if (!token) {
        setIsAdmin(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        setIsAdmin(response.data.is_admin);
      } catch (error) {
        console.error(error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    setIsAdmin(false);

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="navbar-brand">
        🛍️ E-Commerce
      </Link>

      <div className="navbar-links">

        <Link to="/">
          Products
        </Link>

        {token ? (
          <>
            <Link to="/cart">
              🛒 Cart
            </Link>

            <Link to="/orders">
              📦 Orders
            </Link>

            {isAdmin && (
              <Link to="/admin">
                ⚙️ Admin
              </Link>
            )}

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;