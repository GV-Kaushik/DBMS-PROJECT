import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import pool from "./config/db.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const SECRET = "secret";

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const token = jwt.sign({ id: user.user_id, role: user.role }, SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(403).json("No token");

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

app.get("/dashboard", auth, (req, res) => {
  res.json({
    message: "Welcome",
    user: req.user,
  });
});

// cars page routes

app.get("/cars", auth, async (req, res) => {
  const result = await pool.query("SELECT * FROM carmodel ORDER BY model_id");
  res.json(result.rows);
});

app.post("/cars", auth, async (req, res) => {
  const { model_name, company, price, engine_type } = req.body;

  await pool.query(
    "INSERT INTO carmodel (model_name, company, price, engine_type) VALUES ($1,$2,$3,$4)",
    [model_name, company, price, engine_type],
  );

  res.json({ message: "Car added" });
});

app.put("/cars/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { model_name, company, price, engine_type } = req.body;

  await pool.query(
    "UPDATE carmodel SET model_name=$1, company=$2, price=$3, engine_type=$4 WHERE model_id=$5",
    [model_name, company, price, engine_type, id],
  );

  res.json({ message: "Car updated" });
});

app.delete("/cars/:id", auth, async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM carmodel WHERE model_id=$1", [id]);

  res.json({ message: "Car deleted" });
});

// parts page routes

app.get("/parts", auth, async (req, res) => {
  const result = await pool.query("SELECT * FROM part ORDER BY part_id");
  res.json(result.rows);
});

app.post("/parts", auth, async (req, res) => {
  const { part_name, category, cost, quantity } = req.body;

  await pool.query(
    "INSERT INTO part (part_name, category, cost, quantity) VALUES ($1,$2,$3,$4)",
    [part_name, category, cost, quantity],
  );

  res.json({ message: "Part added" });
});

app.put("/parts/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { part_name, category, cost, quantity } = req.body;

  await pool.query(
    "UPDATE part SET part_name=$1, category=$2, cost=$3, quantity=$4 WHERE part_id=$5",
    [part_name, category, cost, quantity, id],
  );

  res.json({ message: "Part updated" });
});

app.delete("/parts/:id", auth, async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM part WHERE part_id=$1", [id]);

  res.json({ message: "Part deleted" });
});

// Assign parts page routes

app.get("/assign", auth, async (req, res) => {
  const result = await pool.query(`
    SELECT cp.id, c.model_name, p.part_name, cp.quantity_required
    FROM carmodel_parts cp
    JOIN carmodel c ON cp.model_id = c.model_id
    JOIN part p ON cp.part_id = p.part_id
    ORDER BY cp.id
  `);

  res.json(result.rows);
});

app.post("/assign", async (req, res) => {
  const { model_id, part_id, quantity_required } = req.body;

  try {
    const stock = await pool.query( // quantoty validation
      "SELECT quantity FROM part WHERE part_id=$1",
      [part_id],
    );

    if (stock.rows.length === 0) {
      return res.status(404).json("Part not found");
    }

    if (quantity_required > stock.rows[0].quantity) {
      return res.status(400).json("Not enough stock");
    }

    await pool.query(
      "INSERT INTO carmodel_parts (model_id, part_id, quantity_required) VALUES ($1,$2,$3)",
      [model_id, part_id, quantity_required],
    );

    res.json({ message: "Assigned successfully" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.delete("/assign/:id", auth, async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM carmodel_parts WHERE id=$1", [id]);

  res.json({ message: "Removed" });
});

// Suppliers page routes
// ================= SUPPLIERS =================

// GET ALL SUPPLIERS
app.get("/suppliers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM supplier ORDER BY supplier_id",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// ADD SUPPLIER
app.post("/suppliers", async (req, res) => {
  const { supplier_name, city, contact } = req.body;

  try {
    await pool.query(
      "INSERT INTO supplier (supplier_name, city, contact) VALUES ($1,$2,$3)",
      [supplier_name, city, contact],
    );

    res.json({ message: "Supplier added" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// DELETE SUPPLIER
app.delete("/suppliers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM supplier WHERE supplier_id=$1", [id]);

    res.json({ message: "Supplier deleted" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// UPDATE SUPPLIER
app.put("/suppliers/:id", async (req, res) => {
  const { id } = req.params;
  const { supplier_name, city, contact } = req.body;

  try {
    await pool.query(
      "UPDATE supplier SET supplier_name=$1, city=$2, contact=$3 WHERE supplier_id=$4",
      [supplier_name, city, contact, id],
    );

    res.json({ message: "Supplier updated" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
