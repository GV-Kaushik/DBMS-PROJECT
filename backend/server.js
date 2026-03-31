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
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );
    app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(email, password); // 🔥 DEBUG

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );

    console.log(result.rows); // 🔥 DEBUG

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      "secret"
    );

    res.json({ token, role: user.role });

  } catch (err) {
    console.log(err); // 🔥 IMPORTANT
    res.status(500).json(err.message);
  }
});

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role
    });

  } catch (err) {
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
    user: req.user
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});