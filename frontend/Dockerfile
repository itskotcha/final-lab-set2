FROM nginx:1.25-alpine

COPY index.html /usr/share/nginx/html/
COPY profile.html /usr/share/nginx/html/
COPY config.js /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]