const express = require("express");
const mysql = require("mysql2");
const authController = require("../controllers/auth");
const carsController = require("../controllers/products");
const router = express.Router();

const con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});
const db = con.promise();

router.get("/", authController.isLoggedIn, (req, res) => {
  res.sendFile("index.html", { root: "./public/" });
});

router.get("/register", (req, res) => {
  res.sendFile("register.html", { root: "./public/" });
});

router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "./public/" });
});

router.get("/profile", authController.isLoggedIn, (req, res) => {
  return res.sendFile("profile.html", { root: "./public/" });
});

router.get("/cars", (req, res) => {
  res.sendFile("cars.html", { root: "./public/" });
});

router.get("/car/:id", (req, res) => {
  res.sendFile("car.html", { root: "./public/" });
});

router.get("/booking", authController.isLoggedIn, (req, res) => {
  res.sendFile("invoice.html", { root: "./public/" });
});

router.get("/api/cars", carsController.getCars);
router.get("/api/cars/:id", carsController.getCarById);
router.get("/api/booking/:id", carsController.getBookingById);

router.get("/api/user/:id", async (req, res) => {
  const Id = req.params.id;
  const result = await db.query("SELECT * FROM users WHERE user_id = ?", [Id]);
  return res.status(200).send({ user: result[0] });
});

module.exports = router;
