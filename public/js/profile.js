document.addEventListener("DOMContentLoaded", () => {
  const id = document.cookie.split("=")[1];
  if (id) {
    // Fetch user details from server using the user ID
    fetch(`/api/user/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const userData = data.user[0];
        const name = " " + userData.first_name + " " + userData.last_name;
        document.getElementById("name").textContent += name;
        document.getElementById("phone").textContent +=
          " " + userData.phone_number;
        document.getElementById("dl").textContent += " " + userData.dlnumber;
        document.getElementById("email").textContent += " " + userData.email;
        document.getElementById("profileImg").src = userData.image;
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    getBooking(id);
  }
});

async function getBooking(userId) {
  try {
    const response = await fetch(`/api/booking/${userId}`); // Fetch rental data by ID from the API
    const booking = await response.json();

    if (booking.error === "No bookings found") {
      document.getElementById("last").innerHTML = "No bookings found.";
    } else {
      const formatDate = (dateString) => {
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        return new Intl.DateTimeFormat("en-GB", options).format(
          new Date(dateString)
        );
      };

      const formattedStartDate = formatDate(booking.rental_start_date);
      const formattedEndDate = formatDate(booking.rental_end_date);
      document.getElementById("make").textContent += " " + booking.make;
      document.getElementById("model").textContent += " " + booking.model;
      document.getElementById("plate").textContent += " " + booking.plate;
      document.getElementById("start").textContent += " " + formattedStartDate;
      document.getElementById("end").textContent += " " + formattedEndDate;
      document.getElementById("cost").textContent += " " + booking.total_cost;
      document.getElementById("car").src = `./assets/cars/${booking.image}`;
    }
  } catch (error) {
    console.error("Error loading latest booking:", error);
  }
}
