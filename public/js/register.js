document.addEventListener("DOMContentLoaded", function () {
  // Function to toggle password visibility
  function toggleVisibility(toggleElement, fieldElement) {
    if (toggleElement && fieldElement) {
      toggleElement.addEventListener("click", function () {
        const isPassword = fieldElement.getAttribute("type") === "password";
        fieldElement.setAttribute("type", isPassword ? "text" : "password");
        toggleElement.classList.toggle("fa-eye");
        toggleElement.classList.toggle("fa-eye-slash");
      });
    }
  }

  // Get the toggle and password fields
  const togglePassword = document.getElementById("togglePassword");
  const passwordField = document.getElementById("password");
  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword"
  );
  const confirmPasswordField = document.getElementById("confirmPassword");

  // Toggle visibility for both password and confirm password fields
  toggleVisibility(togglePassword, passwordField);
  toggleVisibility(toggleConfirmPassword, confirmPasswordField);
  
  // Display the message using an alert if present
  const message = getQueryParam("message");
  if (message) {
    alert(decodeURIComponent(message));
    removeQueryParam();
  }
});


// Function to get query parameters by name
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Function to remove the query parameter from the URL
function removeQueryParam() {
  const url = new URL(window.location.href);
  url.searchParams.delete("message");
  window.history.replaceState({}, document.title, url.pathname);
}

// Function to validate the form
function validateForm(event) {
  const firstName = document
    .querySelector('input[name="first_name"]')
    .value.trim();
  const lastName = document
    .querySelector('input[name="last_name"]')
    .value.trim();
  const email = document.querySelector('input[name="email"]').value.trim();
  const phoneNumber = document
    .querySelector('input[name="phone_number"]')
    .value.trim();
  const dlnumber = document
    .querySelector('input[name="dlnumber"]')
    .value.trim();
  const password = document
    .querySelector('input[name="password"]')
    .value.trim();
  const passwordConfirm = document
    .querySelector('input[name="passwordConfirm"]')
    .value.trim();

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !dlnumber ||
    !password ||
    !passwordConfirm
  ) {
    alert("All fields must be filled out.");
    event.preventDefault(); // Prevent the form from submitting
  }
}

// Add event listener to the form to validate before submission
const form = document.querySelector("form");
   form.addEventListener("submit", validateForm);
