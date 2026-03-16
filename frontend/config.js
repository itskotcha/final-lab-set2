// ===== config.js =====
// ตั้งค่า URL ของแต่ละ service ที่นี่
// ทุก request ผ่าน Nginx gateway (port 8080) เสมอ

const CONFIG = {
  AUTH_SERVICE_URL: window.location.origin,
  TASK_SERVICE_URL: window.location.origin,
  USER_SERVICE_URL: window.location.origin,
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