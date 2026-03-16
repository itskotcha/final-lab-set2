// ===== config.js =====
// ตั้งค่า URL ของแต่ละ service ที่นี่
// เปลี่ยนเป็น Railway URL จริงเมื่อ deploy

const CONFIG = {
  AUTH_SERVICE_URL: window.ENV_AUTH_URL || "http://localhost:3001",
  TASK_SERVICE_URL: window.ENV_TASK_URL || "http://localhost:3002",
  USER_SERVICE_URL: window.ENV_USER_URL || "http://localhost:3003",
};

// ============================================================
//  Token helpers
// ============================================================
function getToken() {
  return localStorage.getItem("jwt_token");
}

function setToken(token) {
  localStorage.setItem("jwt_token", token);
}

function removeToken() {
  localStorage.removeItem("jwt_token");
}

// ============================================================
//  Base fetch wrapper
// ============================================================
async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    removeToken();
    window.location.href = "/index.html";
    return;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || `HTTP ${res.status}`);
  }

  return data;
}