const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// DB config
const DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "",
  database: "movie1_data",
};

// Connect to DB
const db = mysql.createConnection(DB_CONFIG);

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to MySQL database");
});

// ---------------------- ROUTES ----------------------

// GET all movies
app.get("/movies", (req, res) => {
  db.query("SELECT * FROM movies ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch movies" });
    res.json(results);
  });
});

// GET 1 movie
app.get("/movies/:id", (req, res) => {
  db.query("SELECT * FROM movies WHERE id=?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch movie" });
    if (!results.length) return res.status(404).json({ error: "Movie not found" });
    res.json(results[0]);
  });
});

// CREATE movie
app.post("/movies", (req, res) => {
  const { name, rating, image } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Movie name is required" });
  }

  let ratingValue = null;
  if (rating !== undefined && rating !== null && rating !== "") {
    const parsed = parseFloat(rating);
    if (!isNaN(parsed)) ratingValue = parsed;
  }

  db.query(
    "INSERT INTO movies (name, rating, image) VALUES (?, ?, ?)",
    [name.trim(), ratingValue, image || null],
    (err, results) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({ error: "Database insert failed" });
      }
      res.status(201).json({ id: results.insertId });
    }
  );
});

// UPDATE movie
app.put("/movies/:id", (req, res) => {
  const { name, rating, image } = req.body;
  db.query(
    "UPDATE movies SET name=?, rating=?, image=? WHERE id=?",
    [name, rating, image, req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Update failed" });
      res.json({ message: "Updated successfully" });
    }
  );
});

// DELETE movie
app.delete("/movies/:id", (req, res) => {
  db.query("DELETE FROM movies WHERE id=?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ message: "Deleted successfully" });
  });
});

// ---------------------- START SERVER ----------------------
app.listen(5001, () => {
  console.log("Server running on port 5000");
});
