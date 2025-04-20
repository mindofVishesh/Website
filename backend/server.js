// === BACKEND server.js (Express API with missing endpoints) ===

const express = require("express");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "demo",
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

//Get products by Id
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await db("Product")
      .where({ productid: req.params.id })
      .first();

    if (!product) return res.status(404).send("Product not found");
    res.json(product);
  } catch (err) {
    res.status(500).send("Error fetching product");
  }
});

//Insert new product
app.post("/api/products", async (req, res) => {
  try {
    const { productid, Name, Price, Category, Brand, Size, Description } = req.body;
    await db("Product").insert({
      productid, Name, Price, Category, Brand, Size, Description
    });
    res.status(201).send("Product added successfully");
  } catch (err) {
    res.status(500).send("Failed to insert product");
  }
});




//Get products by category
app.get("/api/products/category/:category", async (req, res) => {
  try {
    const products = await db("Product")
      .where({ Category: req.params.category });
    res.json(products);
  } catch (err) {
    res.status(500).send("Error fetching category products");
  }
});
//Search products by name
app.get("/api/products/search/:term", async (req, res) => {
  const term = `%${req.params.term}%`;
  try {
    const results = await db("Product")
      .whereILike("Name", term)
      .orWhereILike("Description", term);
    res.json(results);
  } catch (err) {
    res.status(500).send("Search failed");
  }
});

//Insert new product
app.post("/api/products", async (req, res) => {
  try {
    const { productid, Name, Price, Category, Brand, Size, Description } = req.body;
    await db("Product").insert({
      productid, Name, Price, Category, Brand, Size, Description
    });
    res.status(201).send("Product added successfully");
  } catch (err) {
    res.status(500).send("Failed to insert product");
  }
});

//Update product details
app.put("/api/products/:id", async (req, res) => {
  try {
    // Step 1: List only the fields that are allowed to be updated
    const allowedFields = ['Name', 'Price', 'Category', 'Brand', 'Size', 'Description'];
    const updates = {};

    // Step 2: Loop through allowed fields and build the update object
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Step 3: Check if there are any fields to update
    if (Object.keys(updates).length === 0) {
      return res.status(400).send("No valid fields provided for update.");
    }

    // Step 4: Perform the update
    const result = await db("Product")
      .where({ productid: req.params.id })
      .update(updates);

    // Step 5: Handle case where no rows were updated (invalid ID)
    if (result === 0) {
      return res.status(404).send("Product not found.");
    }

    res.status(200).send("Product updated successfully.");
  } catch (err) {
    console.error("❌ Error updating product:", err.message, err.stack);
    res.status(500).send("Failed to update product.");
  }
});

app.delete("/api/products/:id", async (req,res) =>{
  try {
    const result = await db("Product")
      .where({ productid: req.params.id })
      .del();

    if (result === 0) return res.status(404).send("Product not found");
    res.send("Product deleted");
  } catch (err) {
    res.status(500).send("Failed to delete product");
  }
})

app.get("/api/products/:id/stock", async (req, res) => {
  try {
    const stock = await db("Stock")
      .join("Warehouse", "Stock.WarehouseID", "Warehouse.WarehouseID")
      .select("Stock.Quantity", "Warehouse.Location")
      .where("Stock.productid", req.params.id);

    res.json(stock);
  } catch (err) {
    res.status(500).send("Failed to fetch stock info");
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

//Get all address for a customer
app.get("/api/customers/:customerId/addresses", async (req, res) => {
  try {
    const addresses = await db("Customer")
      .join("Address", "Customer.addressid", "Address.addressid")
      .select("Address.*")
      .where("Customer.CustomerID", req.params.customerId);

    res.json(addresses);
  } catch (err) {
    console.error("❌", err.message);
    res.status(500).send("Failed to fetch addresses");
  }
});

//Get address by Id
app.get("/api/addresses/:id", async (req, res) => {
  try {
    const address = await db("Address")
      .where({ addressid: req.params.id })
      .first();

    if (!address) return res.status(404).send("Address not found");
    res.json(address);
  } catch (err) {
    res.status(500).send("Error fetching address");
  }
});

//add address
app.post("/api/addresses", async (req, res) => {
  try {
    const { street_1, street_2, city, state, zip_code } = req.body;
    const addressid = Math.floor(100000 + Math.random() * 9000); // Random ID

    const result = await db("Address").insert({
      addressid: addressid,
      Street_1: street_1,
      Street_2: street_2,
      City: city,
      State: state,
      Zip_Code: zip_code
    });

    res.status(201).json({ message: "Address added", addressid });
  } catch (err) {
    res.status(500).send("Failed to insert address");
  }
});

//update address
app.put("/api/addresses/:id", async (req, res) => {
  try {
    // Define which fields are allowed to be updated
    const allowedFields = ["Street_1", "Street_2", "City", "State", "Zip_Code"];
    const updates = {};

    // Only include allowed fields that are present in the request
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // If no valid fields were provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).send("No valid fields provided for update.");
    }

    // Perform the update
    const result = await db("Address")
      .where({ addressid: req.params.id })
      .update(updates);

    // If no rows were updated (address not found)
    if (result === 0) {
      return res.status(404).send("Address not found.");
    }

    res.status(200).send("Address updated successfully.");
  } catch (err) {
    console.error("❌ Address update error:", err.message, err.stack);
    res.status(500).send("Failed to update address.");
  }
});

//delete address
app.delete("/api/addresses/:id", async (req, res) => {
  try {
    const result = await db("Address")
      .where({ addressid: req.params.id })
      .del();

    if (result === 0) return res.status(404).send("Address not found");
    res.send("Address deleted");
  } catch (err) {
    res.status(500).send("Failed to delete address");
  }
});
/*
//address is in use
app.get("/api/addresses/:id/in-use" , async(req,res) => {
  const id = req.params.id;

  try{
    const [card] = await db("creditcard")
      .where ({addressid : id})
      .limit(1)

    const [delivery] = await db("creditcard")
      .where ({addressid : id})
      .limit(1)

    const [customer] = await db('Customer')
      .where ({addressid : id})
      .limit(1)

    const [staff] = await db('Staff')
    .where ({addressid : id})
    .limit(1)
    console.log("addressid check:", { card, delivery, customer ,staff});

    if (card || delivery || customer || staff){
      return res.json({in use: true})
    }
    res.json({ inUse: false });
  } catch (err){
    res.status(500).send("Failed to check usage");
  }
})
*/

// Get all credit cards
app.get("/api/cards:customerId/cards", async (req, res) => {
  try {
    const cards = await db("creditcard")
      .where({customerId: req.params.customerId})
    res.json(cards);
  } catch (err) {
    console.error("❌", err.message);
    res.status(500).send("Failed to get credit cards");
  }
});
// Get card details
app.get("/api/cards/:card_number", async (req, res) => {
  try {
    const card = await db("CreditCard")
      .where({ Card_number: req.params.card_number })
      .first();

    if (!card) return res.status(404).send("Card not found");
    res.json(card);
  } catch (err) {
    res.status(500).send("Failed to get card details");
  }
});

//Add card
app.post("/api/cards", async (req, res) => {
  try {
    const { Card_number, CustomerID, Expiry_date, addressid } = req.body;

    await db("CreditCard").insert({
      Card_number,
      CustomerID,
      Expiry_date,
      addressid
    });

    res.status(201).send("Card added successfully");
  } catch (err) {
    console.error("❌", err.message);
    res.status(500).send("Failed to add card");
  }
});


// Update card info (Need to call Update address API to change billing address)
app.put("/api/cards/:card_number", async (req, res) => {
  try {
    // Define fields that can be updated
    const allowedFields = ["Expiry_date", "addressid"];
    const updates = {};

    // Collect only valid fields from req.body
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // If no valid fields were provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).send("No valid fields provided for update.");
    }

    // Perform the update
    const result = await db("CreditCard")
      .where({ Card_number: req.params.card_number })
      .update(updates);

    // If no card was found
    if (result === 0) {
      return res.status(404).send("Card not found");
    }

    res.send("Card updated successfully");
  } catch (err) {
    console.error("❌ Error updating card:", err.message, err.stack);
    res.status(500).send("Failed to update card");
  }
});



//delete card
app.delete("/api/cards/:card_number", async (req, res) => {
  try {
    const result = await db("CreditCard")
      .where({ Card_number: req.params.card_number })
      .del();

    if (result === 0) return res.status(404).send("Card not found");
    res.send("Card deleted successfully");
  } catch (err) {
    res.status(500).send("Failed to delete card");
  }
});
 
//check if card is in use by others
app.get("/api/cards/:card_number/in-use", async (req, res) => {
  try {
    const inUse = await db("Order")
      .where({ card_number: req.params.card_number })
      .first();

    res.json({ inUse: !!inUse });
  } catch (err) {
    console.error("❌", err.message);
    res.status(500).send("Failed to check card usage");
  }
});
//create new order
app.post("/api/orders", async (req, res) => {
  try {
    const { CartID, card_number, Status = "Processing" } = req.body;
    const orderId = Math.floor(Date.now()/1000);

    const result = await db("Order").insert({
      orderId,
      CartID,
      card_number,
      Status,
      Date: new Date().toISOString()
    });
    res.status(201).json({ message: "Order created", orderId });
  } catch (err) {
    console.error("❌", err.message);
    res.status(500).send("Failed to create order");
  }
});

//Add order items
app.post("/api/orders/:orderId/items", async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, buy_amount }]
    const orderItems = items.map(item => ({
      orderId: req.params.orderId,
      productid: item.productId,
      buy_amount: item.buy_amount
    }));

    await db("OrderItem").insert(orderItems);
    res.status(201).send("Order items added");
  } catch (err) {
    res.status(500).send("Failed to add items");
  }
});

//create delivery record
app.post("/api/delivery", async (req, res) => {
  try {
    const {
      deliveryid,
      orderId,
      addressid,
      Delivery_type,
      Delivery_price,
      Ship_date,
      Delivery_date
    } = req.body;

    await db("Delivery").insert({
      deliveryid,
      orderId,
      addressid,
      Delivery_type,
      Delivery_price,
      Ship_date,
      Delivery_date
    });

    res.status(201).send("Delivery created");
  } catch (err) {
    res.status(500).send("Failed to create delivery");
  }
});

//get order history for a customer
app.get("/api/customers/:customerId/orders", async (req, res) => {
  try {
    // Step 1: Get all orders for this customer
    const orders = await db("Order")
      .join("Customer", "Order.CartID", "Customer.CartID")
      .where("Customer.CustomerID", req.params.customerId)
      .select("Order.*");

    // Step 2: For each order, get the items
    const orderIds = orders.map(order => order.orderId);

    const items = await db("OrderItem")
      .join("Product", "OrderItem.productid", "Product.productid")
      .whereIn("OrderItem.orderId", orderIds)
      .select(
        "OrderItem.orderId",
        "OrderItem.productid",
        "OrderItem.buy_amount",
        "Product.Name",
        "Product.Price"
      );

    // Step 3: Group items by orderId
    const itemsByOrder = {};
    for (const item of items) {
      if (!itemsByOrder[item.orderId]) itemsByOrder[item.orderId] = [];
      itemsByOrder[item.orderId].push(item);
    }

    // Step 4: Attach items to orders
    const ordersWithItems = orders.map(order => ({
      ...order,
      items: itemsByOrder[order.orderId] || []
    }));

    res.json(ordersWithItems);
  } catch (err) {
    console.error("❌ Error fetching customer orders:", err.message, err.stack);
    res.status(500).send("Failed to fetch order history");
  }
});

//Get order details including items
app.get("/api/orders/:orderId", async (req, res) => {
  try {
    const order = await db("Order")
      .where({ orderId: req.params.orderId })
      .first();

    const items = await db("OrderItem")
      .join("Product", "OrderItem.productid", "Product.productid")
      .select("Product.Name", "OrderItem.buy_amount", "Product.Price")
      .where("OrderItem.orderId", req.params.orderId);

    res.json({ order, items });
  } catch (err) {
    res.status(500).send("Failed to fetch order details");
  }
});

//update order status
app.put("/api/orders/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body;
    const result = await db("Order")
      .where({ orderId: req.params.orderId })
      .update({ Status: status });

    if (result === 0) return res.status(404).send("Order not found");
    res.send("Order status updated");
  } catch (err) {
    res.status(500).send("Failed to update order status");
  }
});

//get delivery information for an order
app.get("/api/orders/:orderId/delivery", async (req, res) => {
  try {
    const delivery = await db("Delivery")
      .where({ orderId: req.params.orderId })
      .first();

    if (!delivery) return res.status(404).send("Delivery not found");
    res.json(delivery);
  } catch (err) {
    res.status(500).send("Failed to get delivery info");
  }
});

app.listen(3001, () => {
  console.log("✅ Backend running on http://localhost:3001");
});

// --- Stock Management ---
app.get("/api/products/:productId/stock", async (req, res) => {
  try {
    const stock = await db("Stock").where({ productid: req.params.productId });
    res.json(stock);
  } catch (err) {
    res.status(500).send("Failed to fetch stock levels");
  }
});

app.put("/api/products/:productId/stock", async (req, res) => {
  try {
    const { WarehouseID, Quantity } = req.body;
    await db("Stock")
      .where({ productid: req.params.productId, WarehouseID })
      .update({ Quantity });
    res.send("Stock updated");
  } catch (err) {
    res.status(500).send("Failed to update stock");
  }
});

app.get("/api/products/:productId/stock/check", async (req, res) => {
  try {
    const { requiredQty } = req.query;
    const result = await db("Stock")
      .where({ productid: req.params.productId })
      .sum("Quantity as total");
    res.json({ sufficient: result[0].total >= requiredQty });
  } catch (err) {
    res.status(500).send("Failed to check stock");
  }
});

app.post("/api/products/:productId/stock/add", async (req, res) => {
  try {
    const { WarehouseID, Quantity } = req.body;
    await db("Stock").insert({ productid: req.params.productId, WarehouseID, Quantity });
    res.status(201).send("Stock added");
  } catch (err) {
    res.status(500).send("Failed to add stock");
  }
});

app.get("/api/stock", async (req, res) => {
  try {
    const stock = await db("Stock");
    res.json(stock);
  } catch (err) {
    res.status(500).send("Failed to fetch all stock");
  }
});

// --- Warehouse Management ---
app.get("/api/warehouses", async (req, res) => {
  try {
    const warehouses = await db("Warehouse");
    res.json(warehouses);
  } catch (err) {
    res.status(500).send("Failed to fetch warehouses");
  }
});

app.get("/api/warehouses/:id", async (req, res) => {
  try {
    const warehouse = await db("Warehouse")
      .select("Capacity", "Current_usage")
      .where({ WarehouseID: req.params.id })
      .first();
    res.json(warehouse);
  } catch (err) {
    res.status(500).send("Failed to fetch warehouse usage");
  }
});

app.put("/api/warehouses/:id", async (req, res) => {
  try {
    const { Current_usage } = req.body;
    await db("Warehouse")
      .where({ WarehouseID: req.params.id })
      .update({ Current_usage });
    res.send("Warehouse usage updated");
  } catch (err) {
    res.status(500).send("Failed to update warehouse usage");
  }
});

app.get("/api/warehouses/:id/capacity", async (req, res) => {
  try {
    const { requiredSpace } = req.query;
    const warehouse = await db("Warehouse")
      .where({ WarehouseID: req.params.id })
      .first();
    res.json({ hasCapacity: (warehouse.Capacity - warehouse.Current_usage) >= requiredSpace });
  } catch (err) {
    res.status(500).send("Failed to check warehouse capacity");
  }
});

// --- Customer Management ---
app.get("/api/customers/:id", async (req, res) => {
  try {
    const customer = await db("Customer")
      .where({ CustomerID: req.params.id })
      .first();
    res.json(customer);
  } catch (err) {
    res.status(500).send("Failed to get customer info");
  }
});

app.put("/api/customers/:id/balance", async (req, res) => {
  try {
    const { Balance } = req.body;
    await db("Customer")
      .where({ CustomerID: req.params.id })
      .update({ Balance });
    res.send("Customer balance updated");
  } catch (err) {
    res.status(500).send("Failed to update balance");
  }
});

app.put("/api/customers/:id", async (req, res) => {
  try {
    const allowedFields = ["First_name", "Last_name", "Email", "Phone", "addressid"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    if (Object.keys(updates).length === 0) return res.status(400).send("No valid fields provided");
    await db("Customer").where({ CustomerID: req.params.id }).update(updates);
    res.send("Customer details updated");
  } catch (err) {
    res.status(500).send("Failed to update customer details");
  }
});

// --- Transaction Queries ---
app.post("/api/checkout", async (req, res) => {
  const trx = await db.transaction();
  try {
    const { cart, card_number, addressid, deliverytype } = req.body;

    const orderid = Math.floor(Date.now() / 1000);
    const cartid = Math.floor(Math.random() * 100000);

    // Step 1: Insert items into shopping_cart
    for (const productid in cart) {
      const buy_amount = cart[productid];
      await trx("shopping_cart").insert({
        cartid,
        productid,
        buy_amount
      });
    }

    // Step 2: Insert into order
    await trx("order").insert({
      orderid,
      cartid,
      card_num: card_number,
      status: "processing",
      date: new Date().toISOString()
    });

    // Step 3: Insert into orderitem and decrement stock
    for (const productid in cart) {
      const buy_amount = cart[productid];

      await trx("orderitem").insert({
        orderid,
        productid,
        buy_amount
      });

      await trx("stock")
        .where({ productid })
        .decrement("quantity", buy_amount);
    }

    // Step 4: Insert into delivery
    await trx("delivery").insert({
      deliveryid: orderid,
      orderid,
      addressid,
      delivery_type: deliverytype,
      delivery_price: deliverytype === "Express" ? 9.99 : 0,
      ship_date: new Date().toISOString(),
      delivery_date: new Date(Date.now() + 5 * 86400000).toISOString()
    });

    await trx.commit();
    res.send("Checkout completed");
  } catch (err) {
    await trx.rollback();
    console.error("❌ Checkout failed:", err.message, err.stack);
    res.status(500).send("Checkout failed");
  }
});

app.post("/api/orders/:orderId/cancel", async (req, res) => {
  const trx = await db.transaction();
  try {
    const items = await trx("OrderItem").where({ orderId: req.params.orderId });
    for (const item of items) {
      await trx("Stock")
        .where({ productid: item.productid })
        .increment("Quantity", item.buy_amount);
    }
    await trx("Order").where({ orderId: req.params.orderId }).update({ Status: "Cancelled" });
    await trx.commit();
    res.send("Order cancelled and stock restored");
  } catch (err) {
    await trx.rollback();
    res.status(500).send("Cancellation failed");
  }
});

app.get("/api/cards", async (req, res) => {
  try {
    const cards = await db("creditcard");
    res.json(cards);
  } catch (err) {
    res.status(500).send("Failed to get cards");
  }
});