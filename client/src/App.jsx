import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import FavoritesPage from "./pages/FavoritesPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/products" element={
            <PrivateRoute><ProductsPage /></PrivateRoute>
          } />

          <Route path="/categories" element={
            <PrivateRoute><CategoriesPage /></PrivateRoute>
          } />

          <Route path="/favorites" element={
            <PrivateRoute><FavoritesPage /></PrivateRoute>
          } />

          <Route path="/cart" element={
            <PrivateRoute><CartPage /></PrivateRoute>
          } />

          <Route path="/orders" element={
            <PrivateRoute><OrdersPage /></PrivateRoute>
          } />

        </Routes>
      </div>
    </>
  );
}
