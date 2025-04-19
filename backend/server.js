// === BACKEND server.js (Express API with missing endpoints) ===

const express = require("express");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "your_pg_password",
    database: "shopping_db"
  }
});

const app = express();
app.use(cors());
app.use(express.json());

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await db.select("*").from("product");
    res.json(products);
  } catch (err) {
    console.error("❌ Checkout error:", err.message, err.stack);
    res.status(500).send("Server error");
  }
});

// Get all addresses
app.get("/api/addresses", async (req, res) => {
  try {
    const addresses = await db.select("*").from("address");
    res.json(addresses);
  } catch (err) {
    console.error("❌ Checkout error:", err.message, err.stack);
    res.status(500).send("Server error");
  }
});

// Get all credit cards
app.get("/api/cards", async (req, res) => {
  try {
    const cards = await db.select("*").from("creditcard");
    res.json(cards);
  } catch (err) {
    console.error("❌ Checkout error:", err.message, err.stack);
    res.status(500).send("Server error");
  }
});

// Checkout endpoint
app.post("/api/checkout", async (req, res) => {
  try {
    const { cart, addressid, cardnum, deliverytype } = req.body;
    const customerId = 1; // Simulated user session

    const [order] = await db("order")
      .insert({
        orderid: Date.now(),
        cartid: 1001,
        date: new Date().toISOString(),
        status: "Processing",
        card_num: cardnum
      })
      .returning("orderid");

    const items = Object.entries(cart).map(([pid, qty]) => ({
      orderid: order,
      productid: parseInt(pid),
      buy_amount: qty
    }));

    await db("orderitem").insert(items);

    await db("delivery").insert({
      deliveryid: order,
      orderid: order,
      addressid: addressid,
      delivery_type: deliverytype,
      delivery_price: deliverytype === "Express" ? 9.99 : 4.99,
      ship_date: new Date().toISOString(),
      delivery_date: new Date(Date.now() + (deliverytype === "Express" ? 86400000 : 3 * 86400000)).toISOString()
    });

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Checkout error:", err);
    res.status(500).send("Checkout failed");
  }
});

app.listen(3001, () => {
  console.log("✅ Backend running on http://localhost:3001");
});