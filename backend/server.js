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


//FACTORY ROUTES--------------------------------------->
//insert
app.post("/api/factories",async(req,res)=>{
  try{
    const {location,capacity} = req.body;

    if(!location || !capacity){
      return res.status(400).json({error:"All fields are required"});
    }

    const result = await pool.query(
      `INSERT INTO factory (location, capacity)
      VALUES ($1,$2)`,[location, Number(capacity)]
    )
    res.status(201).json({message:"Factory data added"});
  }catch(err){
    console.log(err);
    res.status(500).json({error: err.message});
  }
});
//read all
app.get("/api/factories", async(req,res)=>{
  try{
    const result = await pool.query(
      `SELECT * FROM factory ORDER BY factory_id`
    );

    res.status(200).json(result.rows);
  }catch(err){
    res.status(500).json({error:err.message});
  }
});

//update
app.put("/api/factories/:id",async(req,res)=>{
  try{
    const {location,capacity} = req.body;

    const result= await pool.query(
      `UPDATE factory
      SET location=$1, capacity=$2 WHERE factory_id=$3
      RETURNING *`,[location,capacity,req.params.id]
    );
    if(result.rowCount===0){
      return res.status(404).json({error:"Factory not found"});
    }

    res.status(200).json(result.rows[0]);
  }catch(err){
    res.status(500).json({error:err.message});
  }
});

//delete
app.delete("/api/factories/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM factory WHERE factory_id=$1",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Factory not found" });
    }

    res.status(200).json({ message: "Factory deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//EMPLOYESS 

// CREATE
app.post("/api/employees", async (req, res) => {
  try {
    const { name, role, factory_id } = req.body;

    if (!name || !role || !factory_id) {
      return res.status(400).json({ error: "All fields required" });
    }

    // FK VALIDATION
    const factoryCheck = await pool.query(
      "SELECT * FROM factory WHERE factory_id = $1",
      [factory_id]
    );

    if (factoryCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid factory_id" });
    }

    const result = await pool.query(
      `INSERT INTO employee (name, role, factory_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, role, factory_id]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


// READ ALL (JOIN with factory)
app.get("/api/employees", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          e.employee_id,
          e.name,
          e.role,
          e.factory_id,
          f.location AS factory_location
       FROM employee e
       JOIN factory f ON e.factory_id = f.factory_id
       ORDER BY e.employee_id`
    );

    res.status(200).json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE
app.put("/api/employees/:id", async (req, res) => {
  try {
    const { name, role, factory_id } = req.body;

    // FK VALIDATION
    if (factory_id) {
      const factoryCheck = await pool.query(
        "SELECT * FROM factory WHERE factory_id = $1",
        [factory_id]
      );

      if (factoryCheck.rows.length === 0) {
        return res.status(400).json({ error: "Invalid factory_id" });
      }
    }

    const result = await pool.query(
      `UPDATE employee
       SET name=$1, role=$2, factory_id=$3
       WHERE employee_id=$4
       RETURNING *`,
      [name, role, factory_id, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM employee WHERE employee_id=$1",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DEALERS 
// CREATE
app.post("/api/dealers", async (req, res) => {
  try {
    const { dealer_name, city, contact } = req.body;

    if (!dealer_name || !city || !contact) {
      return res.status(400).json({ error: "All fields required" });
    }

    const result = await pool.query(
      `INSERT INTO dealer (dealer_name, city, contact)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [dealer_name, city, contact]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


// READ ALL
app.get("/api/dealers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM dealer ORDER BY dealer_id"
    );

    res.status(200).json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE
app.put("/api/dealers/:id", async (req, res) => {
  try {
    const { dealer_name, city, contact } = req.body;

    const result = await pool.query(
      `UPDATE dealer
       SET dealer_name=$1, city=$2, contact=$3
       WHERE dealer_id=$4
       RETURNING *`,
      [dealer_name, city, contact, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Dealer not found" });
    }

    res.status(200).json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE
app.delete("/api/dealers/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM dealer WHERE dealer_id=$1",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Dealer not found" });
    }

    res.status(200).json({ message: "Dealer deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// PRODUCTION

// CREATE
app.post("/api/production", async (req, res) => {
  try {
    const { factory_id, model_id, quantity, production_date } = req.body;

    // validation
    if (!factory_id || !model_id || !quantity || !production_date) {
      return res.status(400).json({ error: "All fields required" });
    }

    // check factory
    const factoryCheck = await pool.query(
      "SELECT capacity FROM factory WHERE factory_id = $1",
      [factory_id]
    );

    if (factoryCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid factory_id" });
    }

    // check model
    const modelCheck = await pool.query(
      "SELECT * FROM carmodel WHERE model_id = $1",
      [model_id]
    );

    if (modelCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid model_id" });
    }

    // capacity check
    const capacity = factoryCheck.rows[0].capacity;

    if (quantity > capacity) {
      return res.status(400).json({
        error: `Production exceeds factory capacity (${capacity})`,
      });
    }

    // insert
    const result = await pool.query(
      `INSERT INTO production_record 
       (factory_id, model_id, quantity, production_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [factory_id, model_id, quantity, production_date]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


// READ ALL (JOIN)
app.get("/api/production", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          pr.production_id,
          pr.factory_id,
          pr.model_id,
          f.location AS factory_location,
          cm.model_name,
          pr.quantity,
          pr.production_date
       FROM production_record pr
       JOIN factory f ON pr.factory_id = f.factory_id
       JOIN carmodel cm ON pr.model_id = cm.model_id
       ORDER BY pr.production_id`
    );

    res.status(200).json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//SALES

// CREATE
app.post("/api/sales", async (req, res) => {
  try {
    const { dealer_id, model_id, quantity, sale_date } = req.body;

    // validation
    if (!dealer_id || !model_id || !quantity || !sale_date) {
      return res.status(400).json({ error: "All fields required" });
    }

    // check dealer
    const dealerCheck = await pool.query(
      "SELECT * FROM dealer WHERE dealer_id = $1",
      [dealer_id]
    );

    if (dealerCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid dealer_id" });
    }

    // check model
    const modelCheck = await pool.query(
      "SELECT * FROM carmodel WHERE model_id = $1",
      [model_id]
    );

    if (modelCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid model_id" });
    }

    // insert
    const result = await pool.query(
      `INSERT INTO sales (dealer_id, model_id, quantity, sale_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [dealer_id, model_id, quantity, sale_date]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


// READ ALL (JOIN)
app.get("/api/sales", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          s.sale_id,
          s.dealer_id,
          s.model_id,
          d.dealer_name,
          cm.model_name,
          s.quantity,
          s.sale_date
       FROM sales s
       JOIN dealer d ON s.dealer_id = d.dealer_id
       JOIN carmodel cm ON s.model_id = cm.model_id
       ORDER BY s.sale_id`
    );

    res.status(200).json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// USERS
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY user_id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/users", async (req, res) => {
  const { email, password, role, phone_num, created_date } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, password, role required" });
  }
const dateValue = created_date === "" ? null : created_date;
  try {
    const result = await pool.query(
      `INSERT INTO users (email, password, role, phone_num, created_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [email, password, role, phone_num, dateValue]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(400).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Server error" });
  }
});


app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { email, password, role, phone_num, created_date } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET email=$1,
           password=$2,
           role=$3,
           phone_num=$4,
           created_date=$5
       WHERE user_id=$6
       RETURNING *`,
      [email, password, role, phone_num, created_date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE user_id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});