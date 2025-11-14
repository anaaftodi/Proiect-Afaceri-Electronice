import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  async function loadFavorites() {
    const res = await api.get("/favorites");
    setFavorites(res.data);
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  async function removeFavorite(id) {
    await api.delete(`/favorites/${id}`);
    loadFavorites();
  }

  async function addToCart(productId) {
    await api.post("/cart", { productId, quantity: 1 });
    alert("Produs adăugat în coș");
  }

  return (
    <div>
      <h2>Produsele mele favorite</h2>
      {favorites.length === 0 && <p>Nu ai produse favorite încă.</p>}

      <div className="grid">
        {favorites.map((f) => (
          <div key={f.id} className="card">
            {f.product.imageUrl && (
              <img
                src={f.product.imageUrl}
                alt={f.product.name}
                className="card-image"
              />
            )}
            <div className="card-body">
              <h3>{f.product.name}</h3>
              <p>{f.product.description}</p>
              <p className="price">{f.product.price} lei</p>
              <div className="card-actions">
                <button
                  className="btn-primary"
                  onClick={() => addToCart(f.productId)}
                >
                  Adaugă în coș
                </button>
                <button
                  className="btn-danger"
                  onClick={() => removeFavorite(f.id)}
                >
                  Scoate de la favorite
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
