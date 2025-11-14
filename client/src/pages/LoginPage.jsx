import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/products");
    } catch (err) {
      console.error(err);
      setError("Email sau parolă incorecte");
    }
  }

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <p>Intră în cont pentru a administra produsele și coșul.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Parolă
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn-primary" type="submit">
          Autentificare
        </button>
      </form>
      <p>
        Nu ai cont? <Link to="/register">Înregistrează-te</Link>
      </p>
    </div>
  );
}
