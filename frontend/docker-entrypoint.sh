#!/bin/sh
echo "=== DEBUG: PORT=$PORT ==="
echo "=== DEBUG: checking template ==="
ls -la /etc/nginx/conf.d/
cat > /usr/share/nginx/html/env.js << ENVEOF
window.ENV_AUTH_URL = "${AUTH_SERVICE_URL:-}";
window.ENV_TASK_URL = "${TASK_SERVICE_URL:-}";
window.ENV_USER_URL = "${USER_SERVICE_URL:-}";
ENVEOF

# Substitute $PORT ใน nginx config
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "=== DEBUG: nginx.conf after envsubst ==="
head -5 /etc/nginx/conf.d/default.conf

exec "$@"