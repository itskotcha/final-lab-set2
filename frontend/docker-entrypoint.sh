#!/bin/sh
cat > /usr/share/nginx/html/env.js << ENVEOF
window.ENV_AUTH_URL = "${AUTH_SERVICE_URL:-}";
window.ENV_TASK_URL = "${TASK_SERVICE_URL:-}";
window.ENV_USER_URL = "${USER_SERVICE_URL:-}";
ENVEOF
exec "$@"