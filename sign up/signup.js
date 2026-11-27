const form = document.getElementById("signupForm");
const roleSelect = document.getElementById("role");
const vehicleSection = document.getElementById("vehicleSection");
const message = document.getElementById("message");

// Show vehicle fields only when Customer / Vehicle Owner is selected
roleSelect.addEventListener("change", function () {
  if (roleSelect.value === "Customer / Vehicle Owner") {
    vehicleSection.style.display = "block";
  } else {
    vehicleSection.style.display = "none";
  }
});

// Check form inputs when user clicks Sign Up
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const role = roleSelect.value;
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const vehicleType = document.getElementById("vehicleType").value;
  const vehicleNumber = document.getElementById("vehicleNumber").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // 1. Check required fields
  if (fullName === "" || email === "" || phone === "" || password === "") {
    message.style.color = "#b24c3a";
    message.textContent = "Please fill in all required fields.";
    alert("Please fill in all required fields.");
    return;
  }

  // 2. Check vehicle details for Customer / Vehicle Owner
  if (role === "Customer / Vehicle Owner") {
    if (vehicleType === "" || vehicleNumber === "") {
      message.style.color = "#b24c3a";
      message.textContent = "Please select your vehicle type and registration number.";
      alert("Please select your vehicle type and registration number.");
      return;
    }
  }

  // 3. Check password length
  if (password.length < 6) {
    message.style.color = "#b24c3a";
    message.textContent = "Password must be at least 6 characters.";
    alert("Password must be at least 6 characters.");
    return;
  }

  // 4. Check password match
  if (password !== confirmPassword) {
    message.style.color = "#b24c3a";
    message.textContent = "Passwords do not match.";
    alert("Passwords do not match.");
    return;
  }

  // Success message + alert popup
  const successText = "Account created for " + fullName + " (" + role + ").";
  message.style.color = "#2e7d32";
  message.textContent = successText;
  alert(successText);

  form.reset();
  vehicleSection.style.display = "block";
});