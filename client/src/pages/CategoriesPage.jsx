import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function CategoriesPage() {
  const { user } = useAuth();

  const isAdmin =
    !!user &&
    user.role &&
    user.role.toString().toUpperCase() === "ADMIN";

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadCategories() {
    try {
      setError("");
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories", err);
      setError("Nu s-au putut încărca categoriile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  // USER NORMAL – nu vede nimic util aici
  if (!isAdmin) {
    return (
      <div>
        <h2>Categorii produse</h2>
        <p className="muted">
          Această pagină este disponibilă doar pentru administrator. 
          Te rog folosește pagina de <strong>Produse</strong> pentru a vedea oferta.
        </p>
      </div>
    );
  }

  // ADMIN – CRUD complet

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Numele categoriei nu poate fi gol.");
      return;
    }

    try {
      await api.post("/categories", { name });
      setName("");
      await loadCategories();
    } catch (err) {
      console.error("Error creating category", err);
      setError(
        err.response?.data?.message ||
          "Eroare la crearea categoriei. Ești sigur că ești logat ca admin?"
      );
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Sigur vrei să ștergi această categorie?")) return;
    setError("");

    try {
      await api.delete(`/categories/${id}`);
      await loadCategories();
    } catch (err) {
      console.error("Error deleting category", err);
      setError(
        err.response?.data?.message ||
          "Eroare la ștergerea categoriei."
      );
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");

    if (!editingName.trim()) {
      setError("Numele categoriei nu poate fi gol.");
      return;
    }

    try {
      await api.put(`/categories/${editingId}`, { name: editingName });
      setEditingId(null);
      setEditingName("");
      await loadCategories();
    } catch (err) {
      console.error("Error updating category", err);
      setError(
        err.response?.data?.message ||
          "Eroare la actualizarea categoriei."
      );
    }
  }

  return (
    <div>
      <h2>Administrare categorii produse</h2>
      <p className="muted">
        Ești logat ca <strong>ADMIN</strong>. Poți adăuga, edita și șterge
        categoriile folosite la produse.
      </p>

      {error && <div className="error">{error}</div>}
      {loading && <p>Se încarcă categoriile...</p>}

      {/* Formular ADD categorie */}
      <form onSubmit={handleCreate} className="form-inline">
        <input
          type="text"
          placeholder="Nume categorie (ex: Fotbal)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn-primary" type="submit">
          Adaugă
        </button>
      </form>

      {/* Lista de categorii cu Edit / Delete */}
      <ul className="list">
        {categories.map((cat) => (
          <li key={cat.id} className="list-item">
            {editingId === cat.id ? (
              <form onSubmit={handleUpdate} className="form-inline">
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button className="btn-primary" type="submit">
                  Salvează
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    setEditingId(null);
                    setEditingName("");
                  }}
                >
                  Anulează
                </button>
              </form>
            ) : (
              <>
                <span>{cat.name}</span>
                <div className="list-actions">
                  <button
                    className="btn-outline"
                    type="button"
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditingName(cat.name);
                    }}
                  >
                    Editează
                  </button>
                  <button
                    className="btn-danger"
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Șterge
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
