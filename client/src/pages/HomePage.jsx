import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="home-wrapper">
      <div className="hero">
        <h1>Bine ai venit la SportShop</h1>
        <p>Magazin inspirat de Decathlon — echipamente sportive pentru toate vârstele.</p>

        <div className="hero-buttons">
          <Link to="/products" className="btn-primary">Vezi Produsele</Link>
          <Link to="/categories" className="btn-secondary">Categorii</Link>
        </div>
      </div>
    </div>
  );
}
