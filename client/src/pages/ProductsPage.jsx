import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "",
  });
  const [editingId, setEditingId] = useState(null);

  async function loadData() {
    const [prodRes, catRes] = await Promise.all([
      api.get("/products"),
      api.get("/categories"),
    ]);
    setProducts(prodRes.data);
    setCategories(catRes.data);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      categoryId: Number(form.categoryId),
      imageUrl: form.imageUrl,
    };

    if (editingId) {
      await api.put(`/products/${editingId}`, payload);
    } else {
      await api.post("/products", payload);
    }

    setForm({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      imageUrl: "",
    });
    setEditingId(null);
    loadData();
  }

  async function handleDelete(id) {
    await api.delete(`/products/${id}`);
    loadData();
  }

  function handleEdit(prod) {
    setEditingId(prod.id);
    setForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      categoryId: prod.categoryId,
      imageUrl: prod.imageUrl || "",
    });
  }

  async function addToCart(productId) {
    await api.post("/cart", { productId, quantity: 1 });
    alert("Produs adăugat în coș");
  }

  async function addFavorite(productId) {
    await api.post("/favorites", { productId });
    alert("Produs adăugat la favorite");
  }

  return (
    <div>
      <h2>Produse sportive</h2>
      <p>Gestionează catalogul tău de echipamente sportive.</p>

      <form onSubmit={handleSubmit} className="form-grid">
        <input
          name="name"
          placeholder="Nume produs"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Descriere"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          placeholder="Preț (lei)"
          value={form.price}
          onChange={handleChange}
        />
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
        >
          <option value="">Alege categorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          name="imageUrl"
          placeholder="URL imagine (opțional)"
          value={form.imageUrl}
          onChange={handleChange}
        />
        <button className="btn-primary" type="submit">
          {editingId ? "Salvează modificările" : "Adaugă produs"}
        </button>
      </form>

      <div className="grid">
        {products.map((p) => (
          <div key={p.id} className="card">
            {p.imageUrl && (
              <img src={p.imageUrl} alt={p.name} className="card-image" />
            )}
            <div className="card-body">
              <h3>{p.name}</h3>
              <p className="muted">{p.category?.name}</p>
              <p>{p.description}</p>
              <p className="price">{p.price} lei</p>
              <div className="card-actions">
                <button
                  className="btn-primary"
                  type="button"
                  onClick={() => addToCart(p.id)}
                >
                  Adaugă în coș
                </button>
                <button
                  className="btn-outline"
                  type="button"
                  onClick={() => addFavorite(p.id)}
                >
                  ⭐ Favorite
                </button>
                <button
                  className="btn-outline"
                  type="button"
                  onClick={() => handleEdit(p)}
                >
                  Editează
                </button>
                <button
                  className="btn-danger"
                  type="button"
                  onClick={() => handleDelete(p.id)}
                >
                  Șterge
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
