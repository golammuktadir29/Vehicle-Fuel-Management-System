/* Initialize demo users if not already present */

function initDemoUsers() {
  let users = [];

  try {
    users = JSON.parse(localStorage.getItem("fuelflowUsers")) || [];
  } catch (e) {
    console.error("Error reading users from localStorage:", e);
    users = [];
  }

  if (!Array.isArray(users) || users.length === 0) {
    users = [
      { name: "Customer User", username: "customer", password: "customer123", role: "Customer" },
      { name: "Staff User", username: "staff", password: "staff123", role: "Staff / Cashier" },
      { name: "Manager User", username: "manager", password: "manager123", role: "Station Manager" },
      { name: "Admin User", username: "admin", password: "admin123", role: "Admin" },
    ];

    try {
      localStorage.setItem("fuelflowUsers", JSON.stringify(users));
      console.log("Demo users initialized:", users);
    } catch (e) {
      console.error("Error saving demo users:", e);
    }
  } else {
    console.log("Existing users found:", users);
  }
}

initDemoUsers();

/* Ensure the logged-in user exists in the master user list */

function trackLoggedInUser(username, role) {
  let users = [];

  try {
    users = JSON.parse(localStorage.getItem("fuelflowUsers")) || [];
  } catch (e) {
    users = [];
  }

  if (!Array.isArray(users)) {
    users = [];
  }

  let exists = users.find(function (u) {
    return u.username === username;
  });

  if (!exists) {
    users.push({
      name: username,
      username: username,
      password: "",
      role: role,
    });

    try {
      localStorage.setItem("fuelflowUsers", JSON.stringify(users));
      console.log("Tracked new user:", username, role);
    } catch (e) {
      console.error("Error tracking user:", e);
    }
  }
}

/* Role to page mapping and matching username storage key */

function getRoleConfig(role) {
  switch (role) {
    case "Customer":
      return {
        page: "../customer/customer.html",
        usernameKey: "fuelflowUsername",
      };
    case "Staff / Cashier":
      return {
        page: "../staff/staff.html",
        usernameKey: "fuelflowStaffUsername",
      };
    case "Station Manager":
      return {
        page: "../station-manager/station-manager.html",
        usernameKey: "fuelflowManagerUsername",
      };
    case "Admin":
      return {
        page: "../admin/admin.html",
        usernameKey: "fuelflowAdminUsername",
      };
    default:
      return {
        page: "../customer/customer.html",
        usernameKey: "fuelflowUsername",
      };
  }
}

/* Login Form */

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value;

  console.log("Login attempt:", username, password);

  loginMessage.textContent = "";

  let users = [];

  try {
    users = JSON.parse(localStorage.getItem("fuelflowUsers")) || [];
  } catch (e) {
    console.error("Error reading users:", e);
    loginMessage.textContent = "System error. Please try again.";
    return;
  }

  if (!Array.isArray(users)) {
    users = [];
  }

  let user = users.find(function (u) {
    return u.username === username && u.password === password;
  });

  if (!user) {
    console.log("User not found or wrong password");
    loginMessage.textContent = "Invalid username or password.";
    return;
  }

  console.log("Login successful:", user);

  /* Track this user in the master list (for admin dashboard) */
  trackLoggedInUser(username, user.role);

  /* Save logged-in user info */
  try {
    localStorage.setItem(
      "fuelflowLoggedInUser",
      JSON.stringify({
        username: user.username,
        role: user.role,
      })
    );

    /* Set the display username key matching what the role page reads */
    let roleConfig = getRoleConfig(user.role);
    localStorage.setItem(roleConfig.usernameKey, user.username);
  } catch (e) {
    console.error("Error saving login session:", e);
    loginMessage.textContent = "Session save error. Please try again.";
    return;
  }

  /* Redirect to the appropriate role page */
  let redirectPage = getRoleConfig(user.role).page;

  console.log("Redirecting to:", redirectPage);

  window.location.href = redirectPage;
});