import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/products");
    } catch (err) {
      console.error(err);
      setError("Eroare la înregistrare (email posibil deja folosit)");
    }
  }

  return (
    <div className="auth-card">
      <h2>Înregistrare</h2>
      <p>Creează-ți cont pentru a comanda echipamente sportive.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nume
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
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
          Creează cont
        </button>
      </form>
      <p>
        Ai deja cont? <Link to="/login">Autentifică-te</Link>
      </p>
    </div>
  );
}
