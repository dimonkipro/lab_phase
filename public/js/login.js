document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.getElementById("togglePassword");
  const passwordField = document.getElementById("password");

  togglePassword.addEventListener("click", () => {
    const type =
      passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye-slash");
  });
  // Display the message using an alert if present
  const message = getQueryParam("message");
  if (message) {
    alert(decodeURIComponent(message));
    removeQueryParam();
  }
  // Add event listener to the form to validate before submission
  const form = document.querySelector("form");
  form.addEventListener("submit", validateForm);
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
function validateForm(event) {
  const email = document.querySelector('input[name="email"]').value.trim();
  const password = document
    .querySelector('input[name="password"]')
    .value.trim();
  if (!email || !password) {
    alert("All fields must be filled out.");
    event.preventDefault(); // Prevent the form from submitting
  }
}
