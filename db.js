import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "newpassword",
  database: "workforce",
  waitForConnections: true,
  connectionLimit: 10,
});
