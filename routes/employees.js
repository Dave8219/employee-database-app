const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employees.js");

router.route("/employees").get(getAllEmployees);
router.route("/employee/:employee_id").get(getEmployee);
router.route("/new-employee").post(createEmployee);
router.route("/employees/:employee_id").patch(updateEmployee);
router.route("/employees/:employee_id").delete(deleteEmployee);
module.exports = router;
