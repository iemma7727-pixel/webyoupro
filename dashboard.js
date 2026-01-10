const PAYPAL_USERNAME = "Salhi321";

/* =====================
   INIT
===================== */
document.addEventListener("DOMContentLoaded", () => {

  if (typeof lucide !== "undefined") lucide.createIcons();

  if (localStorage.getItem("client_logged") !== "true") {
    window.location.href = "auth.html";
    return;
  }

  const service = JSON.parse(localStorage.getItem("selected_service"));
  if (!service) return;

  const username = localStorage.getItem("client_name") || "Client";

  let totalPrice = service.basePrice || service.price || 0;
  let totalDays  = service.baseDays  || service.duration || 0;
  service.options = service.options || [];

  /* =====================
     HEADER
  ===================== */
  document.getElementById("clientName").innerText = `Welcome, ${username}`;
  document.getElementById("serviceName").innerText = service.name;
  document.getElementById("cardServiceName").innerText = service.name;

  /* =====================
     UPDATE UI
  ===================== */
  function updateUI() {
    document.getElementById("totalPrice").innerText = `€${totalPrice}`;
    document.getElementById("servicePrice").innerText = `€${totalPrice}`;
    document.getElementById("serviceDuration").innerText = `${totalDays} Days`;
    document.getElementById("headerDuration").innerText = `${totalDays} Days`;
    document.getElementById("cardPrice").innerText = `€${totalPrice}`;
    document.getElementById("cardDays").innerText = `${totalDays} Days`;

    localStorage.setItem("selected_service", JSON.stringify({
      ...service,
      totalPrice,
      totalDays,
      options: service.options
    }));
  }

  updateUI();

  /* =====================
     OPTIONS
  ===================== */
  const OPTIONS = {
    "Landing Page": [
      { name: "Call To Action", price: 75, days: 2 },
      { name: "Contact Form", price: 95, days: 2 },
      { name: "Basic SEO", price: 120, days: 3 }
    ],
    "Business Website": [
      { name: "Responsive Design", price: 150, days: 2 },
      { name: "Pages Setup", price: 250, days: 3 },
      { name: "Contact Form", price: 120, days: 1 }
    ]
  };

  const optionsBox = document.getElementById("options-list");
  const serviceOptions = OPTIONS[service.name] || [];

  serviceOptions.forEach(opt => {
    const label = document.createElement("label");
    label.className = "option-item";
    label.innerHTML = `
      <input type="checkbox">
      ${opt.name} (+€${opt.price} / ${opt.days} Days)
    `;

    label.querySelector("input").addEventListener("change", e => {
      if (e.target.checked) {
        service.options.push(opt);
        totalPrice += opt.price;
        totalDays += opt.days;
      } else {
        service.options = service.options.filter(o => o.name !== opt.name);
        totalPrice -= opt.price;
        totalDays -= opt.days;
      }
      updateUI();
    });

    optionsBox.appendChild(label);
  });

  /* =====================
     PAYPAL
  ===================== */
  document.getElementById("payNowBtn").addEventListener("click", () => {
    if (totalPrice <= 0) {
      alert("Please select a service first");
      return;
    }

    localStorage.setItem("payment_status", "paid");
    document.getElementById("paymentStatus").innerText = "🟢 Paid";
    document.getElementById("paymentStep").innerText = "Completed";

    window.location.href =
      `https://www.paypal.me/${PAYPAL_USERNAME}/${totalPrice}`;
  });

  /* =====================
     LOGOUT
  ===================== */
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "auth.html";
  });

});
document.querySelector(".header h2").style.display = "none";
document.getElementById("servicePrice").style.display = "none";
document.getElementById("serviceDuration").style.display = "none";
const folderBtn = document.getElementById("folderBtn");
const filesPopover = document.getElementById("filesPopover");
const filesList = document.getElementById("filesList");

folderBtn.addEventListener("click", () => {

  filesPopover.style.display =
    filesPopover.style.display === "block" ? "none" : "block";

  filesList.innerHTML = "";

  const files = JSON.parse(localStorage.getItem("uploaded_files")) || [];

  if (files.length === 0) {
    filesList.innerHTML = `<div class="no-files">No files uploaded yet</div>`;
    return;
  }

  files.forEach(file => {
    const div = document.createElement("div");
    div.className = "file-item";
    div.innerHTML = `<strong>${file.name}</strong><span>${file.size}</span>`;
    filesList.appendChild(div);
  });
});
document.addEventListener("click", e => {
  if (!filesPopover.contains(e.target) && !folderBtn.contains(e.target)) {
    filesPopover.style.display = "none";
  }
});
const dashboardBtn = document.getElementById("dashboardBtn");

dashboardBtn.addEventListener("click", () => {
  // تحيد active من الجميع
  document.querySelectorAll(".sidebar a").forEach(a =>
    a.classList.remove("active")
  );

  // تفعل Dashboard
  dashboardBtn.classList.add("active");

  // تسد أي popover محلول
  const filesPopover = document.getElementById("filesPopover");
  if (filesPopover) filesPopover.style.display = "none";

  // ترجع لداشبورد (إلى عندك sections)
  document.querySelector(".main").scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
const messageBtn = document.getElementById("messageBtn");
const messagePopover = document.getElementById("messagePopover");
const messageContent = document.getElementById("messageContent");

messageBtn.addEventListener("click", () => {

  messagePopover.style.display =
    messagePopover.style.display === "block" ? "none" : "block";

  messageContent.innerHTML = "";

  const paymentStatus = localStorage.getItem("payment_status") || "unpaid";

  if (paymentStatus === "paid") {
    messageContent.innerHTML = `
      <div class="file-item">
        <strong>✅ Payment Confirmed</strong>
        <span>Service has started</span>
      </div>
      <div class="file-item">
        <strong>Status</strong>
        <span>In progress</span>
      </div>
    `;
  } else {
    messageContent.innerHTML = `
      <div class="file-item">
        <strong>❌ Payment Missing</strong>
        <span>Service not started</span>
      </div>
      <div class="file-item">
        <strong>Action Required</strong>
        <span>Please complete payment</span>
      </div>
    `;
  }
});
document.addEventListener("click", e => {
  if (
    !filesPopover.contains(e.target) &&
    !folderBtn.contains(e.target) &&
    !messagePopover.contains(e.target) &&
    !messageBtn.contains(e.target)
  ) {
    filesPopover.style.display = "none";
    messagePopover.style.display = "none";
  }
});
document.addEventListener("DOMContentLoaded", () => {

  /* =======================
     AUTH CHECK
  ======================= */
  if (localStorage.getItem("client_logged") !== "true") {
    window.location.href = "auth.html";
    return;
  }

  /* =======================
     SERVICES DATA
  ======================= */
  const SERVICES = {
    "Landing Page": {
      price: 450,
      days: 8,
      options: [
        { name: "Call To Action", price: 75, days: 2 },
        { name: "Contact Form", price: 95, days: 2 },
        { name: "Email / WhatsApp Integration", price: 110, days: 2 },
        { name: "Basic SEO", price: 120, days: 3 },
        { name: "Responsive Design", price: 50, days: 2 }
      ]
    },

    "Business Website": {
      price: 1200,
      days: 15,
      options: [
        { name: "UI/UX + Page Design", price: 350, days: 3 },
        { name: "Responsive Design", price: 150, days: 2 },
        { name: "Pages Setup", price: 250, days: 3 },
        { name: "Contact Form", price: 120, days: 1 },
        { name: "Email + WhatsApp", price: 130, days: 1 }
      ]
    }
  };

  /* =======================
     LOAD SELECTED SERVICE
  ======================= */
  const serviceName = localStorage.getItem("selected_service");
  if (!serviceName || !SERVICES[serviceName]) {
    alert("No service selected");
    return;
  }

  const service = SERVICES[serviceName];

  let totalPrice = service.price;
  let totalDays  = service.days;

  /* =======================
     ELEMENTS
  ======================= */
  const optionsBox   = document.getElementById("options-list");
  const totalPriceEl = document.getElementById("totalPrice");
  const payBtn       = document.getElementById("payNowBtn");

  totalPriceEl.innerText = `€${totalPrice}`;

  /* =======================
     RENDER OPTIONS
  ======================= */
  optionsBox.innerHTML = "";

  service.options.forEach(opt => {
    const label = document.createElement("label");
    label.style.display = "block";
    label.style.marginBottom = "10px";

    label.innerHTML = `
      <input type="checkbox">
      ${opt.name} (+€${opt.price} / ${opt.days} Days)
    `;

    const checkbox = label.querySelector("input");

    checkbox.addEventListener("change", e => {
      if (e.target.checked) {
        totalPrice += opt.price;
        totalDays  += opt.days;
      } else {
        totalPrice -= opt.price;
        totalDays  -= opt.days;
      }

      totalPriceEl.innerText = `€${totalPrice}`;

      localStorage.setItem("order", JSON.stringify({
        service: serviceName,
        basePrice: service.price,
        baseDays: service.days,
        options: service.options.filter(o =>
          [...optionsBox.querySelectorAll("input:checked")]
            .map(i => i.parentElement.innerText)
            .some(t => t.includes(o.name))
        ),
        totalPrice,
        totalDays
      }));
    });

    optionsBox.appendChild(label);
  });

  /* =======================
     PAY BUTTON
  ======================= */
  payBtn.addEventListener("click", () => {
    window.location.href = `https://www.paypal.me/Salhi321/${totalPrice}`;
  });

});
