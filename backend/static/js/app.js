const TOKEN_KEY = "bookshop_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function isLoggedIn() {
  return !!getToken();
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, { ...options, headers });
  if (response.status === 401) {
    clearToken();
    const isLoginRequest = String(path).includes("/api/auth/login");
    if (!isLoginRequest) {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }
  return data;
}

function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

function showAlert(containerId, message, type = "error") {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.textContent = message;
  el.className = `alert ${type}`;
  el.classList.remove("hidden");
}

function hideAlert(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.classList.add("hidden");
}

function updateNav() {
  const loginLink = document.getElementById("nav-login");
  const logoutBtn = document.getElementById("nav-logout");
  const shopLink = document.getElementById("nav-shop");
  const cartLink = document.getElementById("nav-cart");
  const ordersLink = document.getElementById("nav-orders");

  if (isLoggedIn()) {
    if (loginLink) loginLink.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
    if (shopLink) shopLink.classList.remove("hidden");
    if (cartLink) cartLink.classList.remove("hidden");
    if (ordersLink) ordersLink.classList.remove("hidden");
  } else {
    if (loginLink) loginLink.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
    if (shopLink) shopLink.classList.add("hidden");
    if (cartLink) cartLink.classList.add("hidden");
    if (ordersLink) ordersLink.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateNav();
  const logoutBtn = document.getElementById("nav-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearToken();
      window.location.href = "/";
    });
  }
});
