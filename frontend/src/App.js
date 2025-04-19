import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import './App.css';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="logo">🛒 MyShop</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/addresses">Addresses</Link>
          <Link to="/cards">Credit Cards</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/addresses" element={<AddressList />} />
        <Route path="/cards" element={<CardList />} />
      </Routes>
    </Router>
  );
}

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("/api/products").then(res => setProducts(res.data));
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Products</h1>
      <input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <div className="product-grid">
        {filtered.map((p) => (
          <div key={p.productid} className="product-card">
            <h2>{p.name}</h2>
            <p>${p.price}</p>
            <button
              onClick={() => {
                const cart = JSON.parse(localStorage.getItem("cart") || "{}");
                cart[p.productid] = (cart[p.productid] || 0) + 1;
                localStorage.setItem("cart", JSON.stringify(cart));
                alert("Added to cart");
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cart() {
  const [cart, setCart] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderDetails, setOrderDetails] = useState({
    addressid: "",
    cardnum: "",
    deliverytype: "Standard"
  });

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "{}"));
    axios.get("/api/products").then(res => setProducts(res.data));
    axios.get("/api/addresses").then(res => setAddresses(res.data));
    axios.get("/api/cards").then(res => setCards(res.data));
  }, []);

  const handleCheckout = () => {
    axios.post("/api/checkout", { cart, ...orderDetails }).then(() => {
      alert("Order placed!");
      localStorage.removeItem("cart");
      setCart({});
    });
  };

  const productList = products.filter(p => cart[p.productid]);

  return (
    <div className="container">
      <h1>Shopping Cart</h1>
      {productList.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {productList.map(p => (
              <li key={p.productid}>
                {p.name} x {cart[p.productid]}
              </li>
            ))}
          </ul>

          <div className="form-group">
            <label>Delivery Type</label>
            <select onChange={e => setOrderDetails({ ...orderDetails, deliverytype: e.target.value })}>
              <option value="Standard">Standard</option>
              <option value="Express">Express</option>
            </select>
          </div>

          <div className="form-group">
            <label>Select Address</label>
            <select onChange={e => setOrderDetails({ ...orderDetails, addressid: e.target.value })}>
              {addresses.map(a => (
                <option key={a.addressid} value={a.addressid}>{a.street_1}, {a.city}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Credit Card</label>
            <select onChange={e => setOrderDetails({ ...orderDetails, cardnum: e.target.value })}>
              {cards.map(c => (
                <option key={c.card_number} value={c.card_number}>{c.card_number}</option>
              ))}
            </select>
          </div>

          <button onClick={handleCheckout}>Place Order</button>
        </>
      )}
    </div>
  );
}

function AddressList() {
  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    axios.get("/api/addresses").then(res => setAddresses(res.data));
  }, []);
  return (
    <div className="container">
      <h2>Addresses</h2>
      <ul>
        {addresses.map(a => (
          <li key={a.addressid}>{a.street_1}, {a.city}, {a.state}</li>
        ))}
      </ul>
    </div>
  );
}

function CardList() {
  const [cards, setCards] = useState([]);
  useEffect(() => {
    axios.get("/api/cards").then(res => setCards(res.data));
  }, []);
  return (
    <div className="container">
      <h2>Credit Cards</h2>
      <ul>
        {cards.map(c => (
          <li key={c.card_number}>{c.card_number}, Expires: {c.expiry_date}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
