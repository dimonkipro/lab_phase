const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const { log } = require("console");

const con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});
const db = con.promise();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [results] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (
      !results ||
      results.length === 0 ||
      !(await bcrypt.compare(password, results[0].password))
    ) {
      return res.status(401).redirect("/login?message=Invalid credentials");
    }

    const id = results[0].user_id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
    };

    res.cookie("userSave", id, cookieOptions);

    return res.status(200).redirect("/profile");
  } catch (err) {
    return res.status(500).redirect("/login?message=Server error");
  }
};

// Middleware for checking if user is logged in
exports.isLoggedIn = (req, res, next) => {
  const id = req.cookies.userSave;
  if (id) {
    return next();
  }
  return res.status(401).redirect("/login");
};

exports.register = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    dlnumber,
    password,
    passwordConfirm,
  } = req.body;

  try {
    const [results] = await db.query(
      "SELECT email FROM users WHERE email = ?",
      [email]
    );

    if (results.length > 0) {
      return res
        .status(401)
        .redirect("/register.html?message=Email already in use");
    }

    if (password !== passwordConfirm) {
      return res
        .status(401)
        .redirect("/register.html?message=Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    await db.query("INSERT INTO users SET ?", {
      first_name,
      last_name,
      email,
      phone_number,
      dlnumber,
      password: hashedPassword,
    });

    res
      .status(200)
      .redirect("/register.html?message=User registered successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
};

exports.logout = (req, res) => {
  res.cookie("userSave", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  res.status(200).redirect("/");
};

exports.booking = async (req, res) => {
  const { user_id, car_id, rental_start_date, rental_end_date, total_cost } =
    req.body;

  try {
    await db.query("INSERT INTO rentals SET ?", {
      user_id,
      car_id,
      rental_start_date,
      rental_end_date,
      total_cost,
    });
    await db.query("UPDATE cars SET availability = ? WHERE car_id = ?", [
      "rented",
      car_id,
    ]);
    res.status(200).redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
};
