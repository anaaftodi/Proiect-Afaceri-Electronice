import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  async function loadCategories() {
    const res = await api.get("/categories");
    setCategories(res.data);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post("/categories", { name });
    setName("");
    loadCategories();
  }

  async function handleDelete(id) {
    await api.delete(`/categories/${id}`);
    loadCategories();
  }

  async function handleUpdate(e) {
    e.preventDefault();
    await api.put(`/categories/${editingId}`, { name: editingName });
    setEditingId(null);
    setEditingName("");
    loadCategories();
  }

  return (
    <div>
      <h2>Categorii de produse</h2>

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
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditingName(cat.name);
                    }}
                  >
                    Editează
                  </button>
                  <button
                    className="btn-danger"
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
