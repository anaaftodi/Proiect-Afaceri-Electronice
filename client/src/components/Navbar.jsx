import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          SPORTSHOP
        </Link>

        <nav className="nav-links">
          <Link to="/products">Produse</Link>
          <Link to="/categories">Categorii</Link>
          <Link to="/favorites">Favorite</Link>
          <Link to="/cart">Coș</Link>
          <Link to="/orders">Comenzile mele</Link>
        </nav>

        <div className="nav-auth">
          {user ? (
            <>
              <span className="user-name">Salut, {user.name}</span>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn-login" to="/login">
                Login
              </Link>
              <Link className="btn-register" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
