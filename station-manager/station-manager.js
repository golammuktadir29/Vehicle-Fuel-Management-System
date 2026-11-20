/* Login Guard */

let loggedInUser = JSON.parse(localStorage.getItem("fuelflowLoggedInUser"));

if (!loggedInUser) {
  window.location.href = "../login/login.html";
}
console.log("Testing");

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

/* Fuel Stock System */

const stockForm = document.getElementById("stockForm");

function getStock() {
  return JSON.parse(localStorage.getItem("fuelflowManagerStock")) || [];
}

function showStock() {
  let stock = getStock();

  let list = document.getElementById("stockList");

  list.innerHTML = "";

  if (stock.length === 0) {
    list.textContent = "No stock records yet.";

    return;
  }

  stock.forEach(function (item) {
    let card = document.createElement("div");

    card.className = "stock-card";

    let heading = document.createElement("h3");

    heading.textContent = item.fuel;

    card.appendChild(heading);

    let details = [
      ["Available Quantity", item.quantity + " Liters"],
      ["Price Per Liter", item.price + " BDT"],
    ];

    details.forEach(function (itemDetail) {
      let p = document.createElement("p");

      let strong = document.createElement("strong");

      strong.textContent = itemDetail[0] + ": ";

      p.appendChild(strong);

      p.appendChild(document.createTextNode(itemDetail[1]));

      card.appendChild(p);
    });

    list.appendChild(card);
  });

  showDashboard();
}

/* Update Fuel Stock */

stockForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let stockItem = {
    fuel: document.getElementById("stockFuelType").value,
    quantity: document.getElementById("stockQuantity").value,
    price:
      document.getElementById("stockPrice") &&
      document.getElementById("stockPrice").value
        ? document.getElementById("stockPrice").value
        : "0.00",
  };

  let stock = getStock();

  let existingIndex = stock.findIndex(function (item) {
    return item.fuel === stockItem.fuel;
  });

  if (existingIndex !== -1) {
    stock[existingIndex] = stockItem;
  } else {
    stock.push(stockItem);
  }

  localStorage.setItem("fuelflowManagerStock", JSON.stringify(stock));

  document.getElementById("stockMessage").textContent =
    "Stock updated successfully!";

  stockForm.reset();

  showStock();
});

/* Daily Sales System (reads from staff sales) */

function getStaffSales() {
  return JSON.parse(localStorage.getItem("fuelflowStaffSales")) || [];
}

function showDailySales() {
  let sales = getStaffSales();

  let today = new Date().toLocaleDateString();

  let todaySales = sales.filter(function (sale) {
    return sale.date === today;
  });

  let totalRevenue = 0;

  todaySales.forEach(function (sale) {
    totalRevenue += parseFloat(sale.total);
  });

  document.getElementById("dailySalesCount").textContent = todaySales.length;
  document.getElementById("dailyRevenue").textContent = totalRevenue.toFixed(2);

  let list = document.getElementById("dailySalesList");

  list.innerHTML = "";

  if (todaySales.length === 0) {
    list.textContent = "No sales recorded today.";

    return;
  }

  todaySales.forEach(function (sale) {
    let card = document.createElement("div");

    card.className = "sales-card";

    let heading = document.createElement("h3");

    heading.textContent = "Transaction #" + sale.id;

    card.appendChild(heading);

    let details = [
      ["Fuel Type", sale.fuel],
      ["Quantity", sale.quantity + " Liters"],
      ["Vehicle Number", sale.vehicle],
      ["Payment Method", sale.payment],
      ["Total Bill", sale.total + " BDT"],
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

/* Update Fuel Prices */

const priceForm = document.getElementById("priceForm");

function getPrices() {
  return JSON.parse(localStorage.getItem("fuelflowManagerPrices")) || [];
}

function showPrices() {
  let prices = getPrices();

  let list = document.getElementById("priceList");

  list.innerHTML = "";

  if (prices.length === 0) {
    list.textContent = "No price records yet.";

    return;
  }

  prices.forEach(function (item) {
    let card = document.createElement("div");

    card.className = "stock-card";

    let heading = document.createElement("h3");

    heading.textContent = item.fuel;

    card.appendChild(heading);

    let details = [["Price Per Liter", item.price + " BDT"]];

    details.forEach(function (itemDetail) {
      let p = document.createElement("p");

      let strong = document.createElement("strong");

      strong.textContent = itemDetail[0] + ": ";

      p.appendChild(strong);

      p.appendChild(document.createTextNode(itemDetail[1]));

      card.appendChild(p);
    });

    list.appendChild(card);
  });

  showDashboard();
}

priceForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let priceItem = {
    fuel: document.getElementById("priceFuelType").value,
    price: document.getElementById("newPrice").value,
  };

  let prices = getPrices();

  let existingIndex = prices.findIndex(function (item) {
    return item.fuel === priceItem.fuel;
  });

  if (existingIndex !== -1) {
    prices[existingIndex] = priceItem;
  } else {
    prices.push(priceItem);
  }

  localStorage.setItem("fuelflowManagerPrices", JSON.stringify(prices));

  document.getElementById("priceMessage").textContent =
    "Price updated successfully!";

  priceForm.reset();

  showPrices();
});

/* Inventory / Purchases System */

const purchaseForm = document.getElementById("purchaseForm");

function getPurchases() {
  return JSON.parse(localStorage.getItem("fuelflowManagerPurchases")) || [];
}

function showPurchases() {
  let purchases = getPurchases();

  let list = document.getElementById("purchaseList");

  list.innerHTML = "";

  if (purchases.length === 0) {
    list.textContent = "No purchases recorded yet.";

    return;
  }

  purchases.forEach(function (purchase) {
    let card = document.createElement("div");

    card.className = "purchase-card";

    let heading = document.createElement("h3");

    heading.textContent = "Purchase #" + (purchases.indexOf(purchase) + 1);

    card.appendChild(heading);

    let details = [
      ["Fuel Type", purchase.fuel],
      ["Quantity", purchase.quantity + " Liters"],
      ["Total Cost", purchase.cost + " BDT"],
      ["Date", purchase.date],
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

  showDashboard();
}

purchaseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let now = new Date();

  let purchase = {
    fuel: document.getElementById("purchaseFuelType").value,
    quantity: document.getElementById("purchaseQuantity").value,
    cost: document.getElementById("purchaseCost").value,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  let purchases = getPurchases();

  purchases.push(purchase);

  localStorage.setItem("fuelflowManagerPurchases", JSON.stringify(purchases));

  document.getElementById("purchaseMessage").textContent =
    "Purchase recorded successfully!";

  purchaseForm.reset();

  showPurchases();
});

/* Reports */

function showReports() {
  let stock = getStock();
  let sales = getStaffSales();

  let totalRevenue = 0;

  sales.forEach(function (sale) {
    totalRevenue += parseFloat(sale.total);
  });

  let stockValue = 0;

  stock.forEach(function (item) {
    stockValue += parseFloat(item.quantity) * parseFloat(item.price);
  });

  document.getElementById("totalRevenue").textContent = totalRevenue.toFixed(2);
  document.getElementById("stockValue").textContent = stockValue.toFixed(2);

  let list = document.getElementById("reportList");

  list.innerHTML = "";

  if (stock.length === 0) {
    list.textContent = "No stock data available.";

    return;
  }

  stock.forEach(function (item) {
    let card = document.createElement("div");

    card.className = "stock-card";

    let heading = document.createElement("h3");

    heading.textContent = item.fuel;

    card.appendChild(heading);

    let details = [
      ["Stock Quantity", item.quantity + " Liters"],
      ["Price Per Liter", item.price + " BDT"],
      [
        "Stock Value",
        (parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2) +
          " BDT",
      ],
    ];

    details.forEach(function (itemDetail) {
      let p = document.createElement("p");

      let strong = document.createElement("strong");

      strong.textContent = itemDetail[0] + ": ";

      p.appendChild(strong);

      p.appendChild(document.createTextNode(itemDetail[1]));

      card.appendChild(p);
    });

    list.appendChild(card);
  });
}

/* Dashboard */

function showDashboard() {
  let stock = getStock();

  document.getElementById("fuelTypesCount").textContent = stock.length;

  let totalStock = 0;

  stock.forEach(function (item) {
    totalStock += parseFloat(item.quantity);
  });

  document.getElementById("totalStock").textContent = totalStock.toFixed(2);

  showDailySales();
  showPrices();
  showPurchases();
  showReports();
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

showStock();

/* Logout */

document.getElementById("logoutBtn").addEventListener("click", function () {
  let confirmLogout = confirm("Are you sure you want to logout?");

  if (confirmLogout) {
    localStorage.removeItem("fuelflowLoggedInUser");

    window.location.href = "../login/login.html";
  }
});
