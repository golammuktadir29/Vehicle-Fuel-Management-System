/* Page Navigation */

const navButtons = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

navButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    pages.forEach(function (page) {
      page.classList.remove("active-page");
    });

    navButtons.forEach(function (nav) {
      nav.classList.remove("active");
    });

    document.getElementById(button.dataset.page).classList.add("active-page");

    button.classList.add("active");
  });
});

/* Username */

// const setUsernameBtn = document.getElementById("setUsernameBtn");

// function displayUsername() {
//   let username = localStorage.getItem("fuelflowUsername");

//   document.getElementById("currentUsername").textContent = username
//     ? "Hello, " + username
//     : "";

//   setUsernameBtn.textContent = username ? "Change Username" : "Set Username";
// }

// displayUsername();

// setUsernameBtn.addEventListener("click", function () {
//   let username = prompt("Enter your username:");

//   if (username && username.trim() !== "") {
//     localStorage.setItem("fuelflowUsername", username.trim());

//     displayUsername();
//   }
// });

/* Reservation System */

const reservationForm = document.getElementById("reservationForm");

function getReservations() {
  return JSON.parse(localStorage.getItem("fuelflowReservations")) || [];
}

function showReservations() {
  let reservations = getReservations();

  let list = document.getElementById("reservationList");

  list.innerHTML = "";

  if (reservations.length === 0) {
    list.textContent = "No reservations yet.";

    return;
  }

  reservations.forEach(function (reservation, index) {
    let card = document.createElement("div");

    card.className = "reservation-card";

    let heading = document.createElement("h3");

    heading.textContent = "Reservation #" + (index + 1);

    card.appendChild(heading);

    let details = [
      ["Fuel Station", reservation.station],
      ["Fuel", reservation.fuel],
      ["Quantity", reservation.quantity + " Liters"],
      ["Date", reservation.date],
      ["Time", reservation.time],
      ["Status", "Pending"],
    ];

    details.forEach(function (item) {
      let p = document.createElement("p");

      let strong = document.createElement("strong");

      strong.textContent = item[0] + ": ";

      p.appendChild(strong);

      p.appendChild(document.createTextNode(item[1]));

      card.appendChild(p);
    });

    list.appendChild(card);
  });
}

reservationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let reservation = {
    fuel: document.getElementById("fuelType").value,

    quantity: document.getElementById("quantity").value,

    station: document.getElementById("pumpStation").value,

    date: document.getElementById("reservationDate").value,

    time: document.getElementById("timeSlot").value,
  };

  let reservations = getReservations();

  reservations.push(reservation);

  localStorage.setItem("fuelflowReservations", JSON.stringify(reservations));

  document.getElementById("reservationMessage").textContent =
    "Reservation submitted successfully!";

  reservationForm.reset();

  showReservations();
});

showReservations();

/* Update Password */

const passwordForm = document.getElementById("passwordForm");

passwordForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let currentPassword = document.getElementById("currentPassword").value;

  let newPassword = document.getElementById("newPassword").value;

  let confirmPassword = document.getElementById("confirmPassword").value;

  let message = document.getElementById("passwordMessage");

  if (newPassword.length < 8) {
    message.textContent = "Password must contain at least 8 characters.";
  } else if (newPassword !== confirmPassword) {
    message.textContent = "New passwords do not match.";
  } else if (newPassword === currentPassword) {
    message.textContent =
      "New password must be different from current password.";
  } else {
    message.textContent = "Password form validated successfully.";

    passwordForm.reset();
  }
});

/* Complaint System */

const complaintForm = document.getElementById("complaintForm");

complaintForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let complaint = {
    type: document.getElementById("complaintType").value,

    description: document.getElementById("complaintDescription").value,

    date: new Date().toLocaleDateString(),
  };

  let complaints = JSON.parse(localStorage.getItem("fuelflowComplaints")) || [];

  complaints.push(complaint);

  localStorage.setItem("fuelflowComplaints", JSON.stringify(complaints));

  document.getElementById("complaintMessage").textContent =
    "Complaint submitted successfully!";

  complaintForm.reset();
});

/* Emergency Ticket System */

const emergencyForm = document.getElementById("emergencyForm");

function getEmergencyTickets() {
  return JSON.parse(localStorage.getItem("fuelflowEmergencyTickets")) || [];
}

/* Display Emergency Ticket Counter and History */

function showEmergencyTickets() {
  let tickets = getEmergencyTickets();

  let counter = document.getElementById("emergencyTicketCount");

  let list = document.getElementById("emergencyTicketList");

  counter.textContent = tickets.length;

  list.innerHTML = "";

  if (tickets.length === 0) {
    list.textContent = "No emergency tickets yet.";

    return;
  }

  tickets.forEach(function (ticket) {
    let card = document.createElement("div");

    card.className = "emergency-ticket";

    let heading = document.createElement("h3");

    heading.textContent = "Emergency Ticket #" + ticket.id;

    card.appendChild(heading);

    let details = [
      ["Emergency Type", ticket.type],
      ["Location", ticket.location],
      ["Description", ticket.description],
      ["Status", ticket.status],
    ];

    details.forEach(function (item) {
      let p = document.createElement("p");

      let strong = document.createElement("strong");

      strong.textContent = item[0] + ": ";

      p.appendChild(strong);

      p.appendChild(document.createTextNode(item[1]));

      card.appendChild(p);
    });

    list.appendChild(card);
  });
}

/* Create Emergency Ticket */

emergencyForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let tickets = getEmergencyTickets();

  let ticket = {
    id: tickets.length + 1,

    type: document.getElementById("emergencyType").value,

    location: document.getElementById("emergencyLocation").value,

    description: document.getElementById("emergencyDescription").value,

    status: "Submitted",
  };

  tickets.push(ticket);

  localStorage.setItem("fuelflowEmergencyTickets", JSON.stringify(tickets));

  document.getElementById("emergencyMessage").textContent =
    "Emergency Ticket #" + ticket.id + " created successfully!";

  emergencyForm.reset();

  showEmergencyTickets();
});

showEmergencyTickets();

/* Logout */

document.getElementById("logoutBtn").addEventListener("click", function () {
  let confirmLogout = confirm("Are you sure you want to logout?");

  if (confirmLogout) {
    alert("Logout clicked. Connect this to your login system.");
  }
});
