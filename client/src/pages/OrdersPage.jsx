import { useEffect, useState } from "react";
import api from "../api/axiosClient";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      const res = await api.get("/orders/me");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert("Eroare la încărcarea comenzilor");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return <p>Se încarcă comenzile...</p>;
  }

  return (
    <div>
      <h2>Comenzile mele</h2>
      <p className="muted">
        Aici vezi comenzile plasate cu contul tău – total, data și produsele
        comandate.
      </p>

      {orders.length === 0 && <p>Nu ai comenzi încă.</p>}

      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span className="order-id">Comandă #{order.id}</span>
              <span className="order-date">
                Plasată la: {formatDate(order.createdAt)}
              </span>
            </div>

            <div className="order-body">
              <p>
                <strong>Total:</strong>{" "}
                <span className="order-total">{order.total} lei</span>
              </p>
              <p className="muted">
                {order.items.length} produse în comandă
              </p>

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item-row">
                    <div>
                      <span className="order-item-name">
                        Produs #{item.productId}
                      </span>
                      <span className="order-item-qty">
                        x {item.quantity} buc
                      </span>
                    </div>
                    <div className="order-item-price">
                      {item.price} lei / buc
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-footer">
              <span className="order-status">
                Status: <strong>Confirmată</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
