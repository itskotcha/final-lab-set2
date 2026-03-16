FROM nginx:1.25-alpine

COPY index.html   /usr/share/nginx/html/index.html
COPY profile.html /usr/share/nginx/html/profile.html
COPY config.js    /usr/share/nginx/html/config.js
COPY nginx.conf   /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]