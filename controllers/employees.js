const { pool } = require("../db.js");

const getEmployee = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM employees WHERE employee_id = ?",
      [req.params.employee_id]
    );

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employees");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { employee_id, employee_name, hourly_pay, hire_date } = req.body;

    const [result] = await pool.query(
      `INSERT INTO employees (employee_id, employee_name, hourly_pay, hire_date) VALUES(?, ?, ?, ?)`,
      [employee_id, employee_name, hourly_pay, hire_date]
    );

    res.status(200).json({
      message: "Employee created",
      employeeId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { employee_name, hourly_pay, hire_date } = req.body;
    const [update] = await pool.query(
      `UPDATE employees SET employee_name = ?, hourly_pay = ?, hire_date = ? WHERE employee_id = ?`,
      [employee_name, hourly_pay, hire_date, req.params.employee_id]
    );

    if (update.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({
      message: "Employee updated successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM employees WHERE employee_id = ?`,
      [req.params.employee_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee deleted",
    });
  } catch (err) {
    req.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
