// get the 'id' from the URL
function getCarIdFromPath() {
  const pathParts = window.location.pathname.split("/");
  return pathParts[pathParts.length - 1];
}

const carId = getCarIdFromPath();

if (carId) {
  loadCarById(carId);
} else {
  console.error("Car ID not found in the URL");
}

// fetch car details by ID
async function loadCarById(carId) {
  try {
    const response = await fetch(`/api/cars/${carId}`); // Fetch car data by ID from the API
    const car = await response.json();

    const carDetail = document.getElementById("small-container");
    carDetail.innerHTML = ""; 

    const carCard = document.createElement("div");
    carCard.className = "row";

    carCard.innerHTML = `
      <div class="col-2">
        <img src="../assets/cars/${car.image}" name="carImg" />
      </div>
      <div class="col-2">
        <h2 id="carName">${car.make} ${car.model}</h2>
        <h3 style="color: #e5cea8;">${car.price} TND /jour
          <p style="font-size: 0.9rem; padding:0.8rem;">
            10% Discount is granted for rentals exceeding 5 consecutive days
          </p>
        </h3>
        <div class="date">
          <input type="date" name="startDate" id="start-date-input">
          <input type="date" name="endDate" id="end-date-input"/>
        </div>
        <div class="button">
          <a href="/booking" id="bookNowBtn" class="btn btn-warning">Book now</a>
        </div>
        <h3>Car Details &nbsp;<i class="fa fa-indent" style="color: #b58359c4;"></i></h3>
        <h4>Plate Number : ${car.plate}</h4>
        <br />
        <p>
          ${car.description}
        </p>
      </div>
    `;

    carDetail.appendChild(carCard);

    // the "Book now" button
    document.getElementById("bookNowBtn").addEventListener("click", (event) => {
      event.preventDefault();
      const startDate = document.getElementById("start-date-input").value;
      const endDate = document.getElementById("end-date-input").value;

      if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        alert("End date must be after the start date.");
        return;
      }
      // localStorage
      const bookingData = {
        carName: `${car.make} ${car.model}`,
        plate: car.plate,
        price: car.price,
        startDate: startDate,
        endDate: endDate,
        carid: carId,
      };
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      window.location.href = "/booking";
    });
  } catch (error) {
    console.error("Error loading car:", error);
  }
}
