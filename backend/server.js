import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import pool from "./config/db.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const SECRET = "secret";

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(email, password);

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password],
    );

    console.log(result.rows);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const token = jwt.sign({ id: user.user_id, role: user.role }, SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, role: user.role });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

// ================= AUTH MIDDLEWARE =================
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

// ================= TEST ROUTES =================

// public
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// protected
app.get("/dashboard", auth, (req, res) => {
  res.json({
    message: "Welcome",
    user: req.user,
  });
});

// Car Models page routes

app.get("/cars", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM carmodel ORDER BY model_id");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
app.post("/cars", async (req, res) => {
 

  const { model_name, company, price, engine_type } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO carmodel (model_name, company, price, engine_type) VALUES ($1,$2,$3,$4)",
      [model_name, company, price, engine_type],
    );

    res.json({ message: "New Car  is added" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});
// DELETE CAR
app.delete("/cars/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM carmodel WHERE model_id=$1", [id]);

    res.json({ message: "Car deleted" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// UPDATE CAR
app.put("/cars/:id", async (req, res) => {
  const { id } = req.params;
  const { model_name, company, price, engine_type } = req.body;

  try {
    await pool.query(
      "UPDATE carmodel SET model_name=$1, company=$2, price=$3, engine_type=$4 WHERE model_id=$5",
      [model_name, company, price, engine_type, id],
    );

    res.json({ message: "Car  data updated" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Parts page Routes


// GET ALL PARTS
app.get("/parts", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM part ORDER BY part_id"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// ADD PART
app.post("/parts", async (req, res) => {
  const { part_name, category, cost, quantity } = req.body;

  try {
    await pool.query(
      "INSERT INTO part (part_name, category, cost, quantity) VALUES ($1,$2,$3,$4)",
      [part_name, category, cost, quantity]
    );

    res.json({ message: "Part added" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// DELETE PART
app.delete("/parts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM part WHERE part_id=$1",
      [id]
    );

    res.json({ message: "Part deleted" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// UPDATE PART
app.put("/parts/:id", async (req, res) => {
  const { id } = req.params;
  const { part_name, category, cost, quantity } = req.body;

  try {
    await pool.query(
      "UPDATE part SET part_name=$1, category=$2, cost=$3, quantity=$4 WHERE part_id=$5",
      [part_name, category, cost, quantity, id]
    );

    res.json({ message: "Part updated" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
