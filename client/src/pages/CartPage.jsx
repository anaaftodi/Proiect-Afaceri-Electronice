import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [creatingOrder, setCreatingOrder] = useState(false);

  async function loadCart() {
    const res = await api.get("/cart");
    setItems(res.data);
  }

  useEffect(() => {
    loadCart();
  }, []);

  const total = items.reduce(
    (sum, it) => sum + it.quantity * it.product.price,
    0
  );

  async function updateQuantity(id, quantity) {
    await api.put(`/cart/${id}`, { quantity });
    loadCart();
  }

  async function removeItem(id) {
    await api.delete(`/cart/${id}`);
    loadCart();
  }

  async function clearCart() {
    await api.delete("/cart");
    loadCart();
  }

  async function createOrder() {
    if (!items.length) return;
    setCreatingOrder(true);
    try {
      const payload = {
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          price: it.product.price,
        })),
      };
      await api.post("/orders", payload);
      await clearCart();
      alert("Comandă creată!");
    } catch (err) {
      console.error(err);
      alert("Eroare la creare comandă");
    } finally {
      setCreatingOrder(false);
    }
  }

  return (
    <div>
      <h2>Coșul meu</h2>
      {items.length === 0 && <p>Coșul este gol.</p>}

      <ul className="list">
        {items.map((it) => (
          <li key={it.id} className="list-item">
            <div>
              <strong>{it.product.name}</strong> – {it.product.price} lei
              <div className="muted">Cantitate: {it.quantity}</div>
            </div>
            <div className="list-actions">
              <button
                className="btn-outline"
                onClick={() => updateQuantity(it.id, it.quantity + 1)}
              >
                +
              </button>
              <button
                className="btn-outline"
                disabled={it.quantity <= 1}
                onClick={() => updateQuantity(it.id, it.quantity - 1)}
              >
                -
              </button>
              <button
                className="btn-danger"
                onClick={() => removeItem(it.id)}
              >
                Șterge
              </button>
            </div>
          </li>
        ))}
      </ul>

      {items.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>Total: {total} lei</strong>
          </p>
          <button
            className="btn-primary"
            disabled={creatingOrder}
            onClick={createOrder}
          >
            Finalizează comanda
          </button>
          <button
            className="btn-outline"
            style={{ marginLeft: "0.5rem" }}
            onClick={clearCart}
          >
            Golește coșul
          </button>
        </div>
      )}
    </div>
  );
}
