const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

exports.getCars = async (req, res) => {
  db.query("SELECT * FROM cars", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database query failed" });
    }

    res.json(results);
  });
};

exports.getCarById = (req, res) => {
  const carId = req.params.id;

  db.query("SELECT * FROM cars WHERE car_id = ?", [carId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(results[0]);
  });
};

exports.getBookingById = (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT rentals.rental_start_date, rentals.rental_end_date, rentals.total_cost, cars.make, cars.model, cars.image, cars.plate
    FROM rentals
    JOIN cars ON rentals.car_id = cars.car_id
    WHERE rentals.user_id = ?
    ORDER BY rentals.rental_id DESC 
    LIMIT 1
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No bookings found" });
    }

    res.json(results[0]);
  });
};
