document.addEventListener("DOMContentLoaded", () => {
  const id = document.cookie.split("=")[1];
  const bookingData = JSON.parse(localStorage.getItem("bookingData"));
  const button = document.getElementById("printButton");

  button.addEventListener("click", function () {
    button.style.display = "none";
    window.print();
  });
  if (id) {
    // Fetch user details from your server using the user ID
    fetch(`/api/user/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const userData = data.user[0];
        document.getElementById("fname").textContent = userData.first_name;
        document.getElementById("lname").textContent = userData.last_name;
        document.getElementById("phone").textContent = userData.phone_number;
        document.getElementById("dl").textContent = userData.dlnumber;
        document.getElementById("email").textContent = userData.email;
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    
  }
  if (bookingData) {
    const carNameElement = document.getElementById("carname");
    const plateElement = document.getElementById("plate");
    const priceElement = document.getElementById("price");
    const startDateElement = document.getElementById("start");
    const endDateElement = document.getElementById("end");
    const daysElement = document.getElementById("days");
    const totalElement = document.querySelector(".total strong + span");

    carNameElement.textContent = bookingData.carName;
    plateElement.textContent = bookingData.plate;
    priceElement.textContent = `${bookingData.price} TND`;

    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const numberOfDays = Math.ceil(
      (endDate - startDate) / (1000 * 60 * 60 * 24)
    );

    startDateElement.textContent = bookingData.startDate;
    endDateElement.textContent = bookingData.endDate;
    daysElement.textContent = `${numberOfDays} days`;

    const total = numberOfDays * bookingData.price;
    totalElement.textContent = `${total} TND`;

    document.getElementById("userid").value = id;
    document.getElementById("carid").value = bookingData.carid;
    document.getElementById("startt").value = bookingData.startDate;
    document.getElementById("endd").value = bookingData.endDate;
    document.getElementById("total").value = total;
  }
});


