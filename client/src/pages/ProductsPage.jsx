import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function ProductsPage() {
  const { user } = useAuth();
  const isAdmin =
    !!user &&
    user.role &&
    user.role.toString().toUpperCase() === "ADMIN";

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
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  async function loadProducts(categoryId = "") {
    const url = categoryId
      ? `/products?categoryId=${categoryId}`
      : "/products";
    const res = await api.get(url);
    setProducts(res.data);
  }

  async function loadCategories() {
    const res = await api.get("/categories");
    setCategories(res.data);
  }

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  // când schimbăm filtrul
  useEffect(() => {
    loadProducts(selectedCategoryId);
  }, [selectedCategoryId]);

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
    loadProducts(selectedCategoryId);
  }

  async function handleDelete(id) {
    await api.delete(`/products/${id}`);
    loadProducts(selectedCategoryId);
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
      <p className="muted">
        Poți filtra produsele după categorie sau poți vedea toate produsele.
      </p>

      {/* FILTRU după categorie – pentru toți userii */}
      <div className="form-inline" style={{ marginBottom: "20px" }}>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <option value="">Toate categoriile</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn-outline"
          onClick={() => setSelectedCategoryId("")}
        >
          Reset filtrul
        </button>
      </div>

      {/* FORMULAR CRUD – DOAR ADMIN */}
      {isAdmin && (
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
      )}

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

                {/* butoane de admin DOAR dacă e admin */}
                {isAdmin && (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
