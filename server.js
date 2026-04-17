const express = require("express");
const app = express();

const { pool } = require("./db.js");

const PORT = process.env.port || 5000;

const employees = require("./routes/employees.js");
app.use(express.json());

app.use("/api/v1", employees);

app.get("/", (req, res) => {
  const message = "Hello, username";
  res.status(200).json(message);
});

/*
app.get("/employees", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employees");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
