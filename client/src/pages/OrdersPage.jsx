import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders", err);
      setError(
        err.response?.data?.message || "Nu s-au putut încărca comenzile."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div>
      <h2>Comenzile mele</h2>
      <p className="muted">
        Aici poți vedea comenzile pe care le-ai plasat în magazin.
      </p>

      {loading && <p>Se încarcă...</p>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && orders.length === 0 && (
        <p>Nu ai nicio comandă încă.</p>
      )}

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="card">
            <div className="card-body">
              <h3>Comanda #{order.id}</h3>
              <p className="muted">
                Plasată la:{" "}
                {new Date(order.createdAt).toLocaleString("ro-RO")}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              {order.address && (
                <p>
                  <strong>Adresă livrare:</strong> {order.address}
                </p>
              )}
              {order.paymentMethod && (
                <p>
                  <strong>Metodă de plată:</strong> {order.paymentMethod}
                </p>
              )}
              <p>
                <strong>Total:</strong> {order.total} lei
              </p>

              {order.items && order.items.length > 0 && (
                <>
                  <h4 style={{ marginTop: "10px" }}>Produse</h4>
                  <ul className="list">
                    {order.items.map((item) => (
                      <li key={item.id} className="list-item">
                        <span>
                          {item.product?.name || "Produs"} x {item.quantity}
                        </span>
                        <span>
                          {item.price * item.quantity} lei
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
