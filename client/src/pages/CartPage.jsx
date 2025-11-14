import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Card");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function loadCart() {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Error loading cart", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function handleDelete(id) {
    try {
      await api.delete(`/cart/${id}`);
      loadCart();
    } catch (err) {
      console.error("Error deleting", err);
    }
  }

  async function handleQuantityChange(id, qty) {
    if (qty < 1) return;
    try {
      await api.put(`/cart/${id}`, { quantity: qty });
      loadCart();
    } catch (err) {
      console.error("Error updating quantity", err);
    }
  }

  async function finalizeOrder() {
    if (!address.trim()) {
      setError("Completează adresa de livrare.");
      return;
    }

    setError("");

    try {
      await api.post("/orders", {
        address,
        paymentMethod: payment,
      });

      navigate("/orders");
    } catch (err) {
      console.error("Error creating order", err);
      setError("A apărut o eroare. Reîncearcă.");
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  return (
    <div>
      <h2>Coșul meu</h2>

      {loading && <p>Se încarcă...</p>}

      {!loading && cart.length === 0 && <p>Coșul este gol.</p>}

      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.id} className="cart-row">
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="cart-thumb"
            />
            <div className="cart-main">
              <strong>{item.product.name}</strong>
              <p className="muted">{item.product.description}</p>
              <p>Preț: {item.product.price} lei</p>

              <div className="qty-controls">
                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>

                <button className="btn-danger" onClick={() => handleDelete(item.id)}>
                  Elimină
                </button>
              </div>
            </div>

            <div className="cart-line-total">
              {item.product.price * item.quantity} lei
            </div>
          </li>
        ))}
      </ul>

      {cart.length > 0 && (
        <>
          <h3 className="cart-total-line">Total: {total} lei</h3>

          {/* FORMULAR CHECKOUT */}
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              maxWidth: "400px",
            }}
          >
            <h3>Finalizare comandă</h3>

            {error && (
              <div
                style={{
                  background: "#ffdddd",
                  color: "#a00",
                  padding: "8px",
                  marginBottom: "10px",
                  borderRadius: "4px",
                }}
              >
                {error}
              </div>
            )}

            <label>Adresă de livrare:</label>
            <input
              type="text"
              placeholder="Ex: Str. Exemplu nr. 10, București"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            <label>Metodă de plată:</label>
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "20px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="Card">Card</option>
              <option value="Ramburs">Ramburs</option>
            </select>

            <button
              className="btn-primary"
              onClick={finalizeOrder}
              style={{ width: "100%", padding: "10px 0" }}
            >
              Plasează comanda
            </button>
          </div>
        </>
      )}
    </div>
  );
}
