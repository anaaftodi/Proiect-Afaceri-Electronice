import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  async function loadOrders() {
    const res = await api.get("/orders/me");
    setOrders(res.data);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div>
      <h2>Comenzile mele</h2>
      {orders.length === 0 && <p>Nu ai comenzi încă.</p>}
      <ul className="list">
        {orders.map((o) => (
          <li key={o.id} className="list-item">
            <div>
              <strong>Comandă #{o.id}</strong> – total {o.total} lei
              <div className="muted">Items: {o.items.length}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
