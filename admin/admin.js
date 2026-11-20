/* Login Guard */

let loggedInUser = JSON.parse(localStorage.getItem("fuelflowLoggedInUser"));

if (!loggedInUser) {
  window.location.href = "../login/login.html";
}

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

/* Auto-set username from login */

function displayUsername() {
  document.getElementById("currentUsername").textContent = loggedInUser.username
    ? "Hello, " + loggedInUser.username
    : "";
}

displayUsername();

/* User Accounts System */

const userForm = document.getElementById("userForm");
const userFormBtn = document.getElementById("userFormBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const searchForm = document.getElementById("searchForm");
const clearSearchBtn = document.getElementById("clearSearchBtn");

let editingIndex = null;

/* Cancel Edit */

cancelEditBtn.addEventListener("click", function () {
  editingIndex = null;
  userForm.reset();
  userFormBtn.textContent = "Add User";
  cancelEditBtn.style.display = "none";
  document.getElementById("userMessage").textContent = "";
});

/* Search Users */

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let role = document.getElementById("searchRole").value.trim();
  let username = document.getElementById("searchUsername").value.trim();
  let password = document.getElementById("searchPassword").value.trim();

  showUsers(role || null, username || null, password || null);
});

/* Clear Search */

clearSearchBtn.addEventListener("click", function () {
  document.getElementById("searchRole").value = "";
  document.getElementById("searchUsername").value = "";
  document.getElementById("searchPassword").value = "";
  document.getElementById("userList").innerHTML = "";
  document.getElementById("userList").textContent = "Use the search above to find users.";
});

/* Start Edit */

function startEdit(username) {
  let users = getUsers();
  let user = users.find(function (u) {
    return u.username === username;
  });

  if (!user) {
    return;
  }

  document.getElementById("userUsername").value = user.username;
  document.getElementById("userPassword").value = user.password;
  document.getElementById("userRole").value = user.role;

  /* If editing the logged-in admin, disable password field */
  let loggedInUser = JSON.parse(localStorage.getItem("fuelflowLoggedInUser")) || {};
  if (loggedInUser.username === user.username && loggedInUser.role === "Admin") {
    document.getElementById("userPassword").disabled = true;
    document.getElementById("userPassword").placeholder = "Cannot change via User Accounts (use Settings)";
  } else {
    document.getElementById("userPassword").disabled = false;
    document.getElementById("userPassword").placeholder = "Example: pass123";
  }

  editingIndex = username;
  userFormBtn.textContent = "Update User";
  cancelEditBtn.style.display = "inline-block";
  document.getElementById("userMessage").textContent = "";
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("fuelflowUsers")) || [];
  } catch (e) {
    return [];
  }
}

function showUsers(filterRole, filterUsername, filterPassword) {
  let users = getUsers();

  /* Apply filters */
  if (filterRole || filterUsername || filterPassword) {
    users = users.filter(function (user) {
      let match = true;

      if (filterRole && user.role !== filterRole) {
        match = false;
      }

      if (filterUsername && user.username !== filterUsername) {
        match = false;
      }

      if (filterPassword && user.password !== filterPassword) {
        match = false;
      }

      return match;
    });
  }

  let list = document.getElementById("userList");

  list.innerHTML = "";

  if (users.length === 0) {
    list.textContent = "No users found.";

    return;
  }

  users.forEach(function (user, index) {
    let card = document.createElement("div");

    card.className = "user-card";

    let details = [
      ["Username", user.username],
      ["Password", user.password],
      ["Role", user.role],
    ];

    details.forEach(function (item) {
      let p = document.createElement("p");

      let strong = document.createElement("strong");

      strong.textContent = item[0] + ": ";

      p.appendChild(strong);

      p.appendChild(document.createTextNode(item[1]));

      card.appendChild(p);
    });

    let editBtn = document.createElement("button");

    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.style.marginTop = "10px";
    editBtn.style.marginLeft = "6px";
    editBtn.style.background = "#76583e";
    editBtn.style.color = "#fff";
    editBtn.style.border = "0";
    editBtn.style.padding = "6px 12px";
    editBtn.style.borderRadius = "2px";
    editBtn.style.cursor = "pointer";

    editBtn.addEventListener("click", function () {
      startEdit(user.username);
    });

    card.appendChild(editBtn);

    /* Only show Remove button for non-admin users */
    if (user.role !== "Admin") {
      let removeBtn = document.createElement("button");

      removeBtn.type = "button";
      removeBtn.textContent = "Remove";
      removeBtn.style.marginTop = "10px";
      removeBtn.style.background = "#a94442";
      removeBtn.style.color = "#fff";
      removeBtn.style.border = "0";
      removeBtn.style.padding = "6px 12px";
      removeBtn.style.borderRadius = "2px";
      removeBtn.style.cursor = "pointer";

      removeBtn.addEventListener("click", function () {
        removeUser(user.username);
      });

      card.appendChild(removeBtn);
    }

    list.appendChild(card);
  });
}

/* Remove User */

function removeUser(username) {
  let users = getUsers();
  let targetUser = users.find(function (u) {
    return u.username === username;
  });

  let loggedInUser = JSON.parse(localStorage.getItem("fuelflowLoggedInUser")) || {};

  /* Prevent removing another admin */
  if (targetUser && targetUser.role === "Admin" && loggedInUser.role === "Admin") {
    alert("You cannot remove another admin user.");
    return;
  }

  let confirmRemove = confirm("Are you sure you want to remove this user?");

  if (confirmRemove) {
    let editIndex = users.findIndex(function (u) {
      return u.username === username;
    });

    if (editIndex !== -1) {
      users.splice(editIndex, 1);
    }

    localStorage.setItem("fuelflowUsers", JSON.stringify(users));

    showUsers();
  }
}

/* Add User */

userForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let user = {
    username: document.getElementById("userUsername").value,
    password: document.getElementById("userPassword").value,
    role: document.getElementById("userRole").value,
  };

  let users = getUsers();

  if (editingIndex !== null) {
    let editIndex = users.findIndex(function (u) {
      return u.username === editingIndex;
    });

    if (editIndex !== -1) {
      users[editIndex] = user;
    }

    document.getElementById("userMessage").textContent =
      "User updated successfully!";

    editingIndex = null;
    userFormBtn.textContent = "Add User";
    cancelEditBtn.style.display = "none";
  } else {
    users.push(user);

    document.getElementById("userMessage").textContent =
      "User added successfully!";
  }

  localStorage.setItem("fuelflowUsers", JSON.stringify(users));

  userForm.reset();

  showUsers();
});

/* Fuel Types & Prices System */

const fuelForm = document.getElementById("fuelForm");

function getFuels() {
  try {
    return JSON.parse(localStorage.getItem("fuelflowAdminFuels")) || [];
  } catch (e) {
    return [];
  }
}

function showFuels() {
  let fuels = getFuels();

  let list = document.getElementById("fuelList");

  list.innerHTML = "";

  if (fuels.length === 0) {
    list.textContent = "No fuel types defined yet.";

    return;
  }

  fuels.forEach(function (fuel) {
    let card = document.createElement("div");

    card.className = "fuel-card";

    let heading = document.createElement("h3");

    heading.textContent = fuel.name;

    card.appendChild(heading);

    let details = [
      ["Price Per Liter", fuel.price + " BDT"],
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

/* Add / Update Fuel */

fuelForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let fuelItem = {
    name: document.getElementById("fuelName").value,
    price: document.getElementById("fuelPrice").value,
  };

  let fuels = getFuels();

  let existingIndex = fuels.findIndex(function (fuel) {
    return fuel.name === fuelItem.name;
  });

  if (existingIndex !== -1) {
    fuels[existingIndex] = fuelItem;
  } else {
    fuels.push(fuelItem);
  }

  localStorage.setItem("fuelflowAdminFuels", JSON.stringify(fuels));

  document.getElementById("fuelMessage").textContent =
    "Fuel type added / updated successfully!";

  fuelForm.reset();

  showFuels();
});

/* Transactions System (reads from staff sales) */

function getStaffSales() {
  try {
    return JSON.parse(localStorage.getItem("fuelflowStaffSales")) || [];
  } catch (e) {
    return [];
  }
}

function showTransactions() {
  let sales = getStaffSales();

  let totalRevenue = 0;

  sales.forEach(function (sale) {
    totalRevenue += parseFloat(sale.total);
  });

  document.getElementById("transactionCount").textContent = sales.length;
  document.getElementById("transactionRevenue").textContent =
    totalRevenue.toFixed(2);

  let list = document.getElementById("transactionList");

  list.innerHTML = "";

  if (sales.length === 0) {
    list.textContent = "No transactions found.";

    return;
  }

  sales.forEach(function (sale) {
    let card = document.createElement("div");

    card.className = "transaction-card";

    let heading = document.createElement("h3");

    heading.textContent = "Transaction #" + sale.id;

    card.appendChild(heading);

    let details = [
      ["Fuel Type", sale.fuel],
      ["Quantity", sale.quantity + " Liters"],
      ["Price Per Liter", sale.price + " BDT"],
      ["Total Bill", sale.total + " BDT"],
      ["Vehicle Number", sale.vehicle],
      ["Payment Method", sale.payment],
      ["Date", sale.date],
      ["Time", sale.time],
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

/* Station Information System */

const stationForm = document.getElementById("stationForm");

function getStation() {
  try {
    return JSON.parse(localStorage.getItem("fuelflowAdminStation")) || null;
  } catch (e) {
    return null;
  }
}

function showStation() {
  let station = getStation();

  let details = document.getElementById("stationDetails");

  if (!station) {
    details.textContent = "No station information saved yet.";

    return;
  }

  details.innerHTML = "";

  let card = document.createElement("div");
  card.className = "station-card";

  let heading = document.createElement("h3");
  heading.textContent = station.name;
  card.appendChild(heading);

  let info = [
    ["Address", station.address],
    ["Contact", station.contact],
  ];

  info.forEach(function (item) {
    let p = document.createElement("p");

    let strong = document.createElement("strong");
    strong.textContent = item[0] + ": ";

    p.appendChild(strong);
    p.appendChild(document.createTextNode(item[1]));

    card.appendChild(p);
  });

  details.appendChild(card);
}

stationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let station = {
    name: document.getElementById("stationName").value,
    address: document.getElementById("stationAddress").value,
    contact: document.getElementById("stationContact").value,
  };

  localStorage.setItem("fuelflowAdminStation", JSON.stringify(station));

  document.getElementById("stationMessage").textContent =
    "Station information saved successfully!";

  stationForm.reset();

  showStation();
});

/* System Overview */

function showSystemOverview() {
  let users = getUsers();
  let fuels = getFuels();
  let sales = getStaffSales();

  let totalRevenue = 0;

  sales.forEach(function (sale) {
    totalRevenue += parseFloat(sale.total);
  });

  document.getElementById("sysUsers").textContent = users.length;
  document.getElementById("sysFuelTypes").textContent = fuels.length;
  document.getElementById("sysTransactions").textContent = sales.length;
  document.getElementById("sysRevenue").textContent =
    totalRevenue.toFixed(2);

  let activity = document.getElementById("systemActivity");

  activity.innerHTML = "";

  if (users.length === 0 && fuels.length === 0 && sales.length === 0) {
    activity.textContent = "No activity data available.";

    return;
  }

  if (users.length > 0) {
    let p = document.createElement("p");
    p.textContent = "Registered Users: " + users.length;
    activity.appendChild(p);
  }

  if (fuels.length > 0) {
    let p = document.createElement("p");
    p.textContent = "Fuel Types Defined: " + fuels.length;
    activity.appendChild(p);
  }

  if (sales.length > 0) {
    let p = document.createElement("p");
    p.textContent = "Total Transactions Monitored: " + sales.length;
    activity.appendChild(p);
  }

  if (totalRevenue > 0) {
    let p = document.createElement("p");
    p.textContent = "Total Revenue: " + totalRevenue.toFixed(2) + " BDT";
    activity.appendChild(p);
  }
}

/* Dashboard */

function showDashboard() {
  let users = getUsers();
  let fuels = getFuels();
  let sales = getStaffSales();

  document.getElementById("totalUsers").textContent = users.length;
  document.getElementById("totalFuelTypes").textContent = fuels.length;
  document.getElementById("totalTransactions").textContent = sales.length;

  showFuels();
  showTransactions();
  showStation();
  showSystemOverview();
}

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

/* Initialize */

try {
  showDashboard();
} catch (e) {
  console.error("Dashboard load error:", e);
}

/* Logout */

document.getElementById("logoutBtn").addEventListener("click", function () {
  let confirmLogout = confirm("Are you sure you want to logout?");

  if (confirmLogout) {
    localStorage.removeItem("fuelflowLoggedInUser");

    window.location.href = "../login/login.html";
  }
});