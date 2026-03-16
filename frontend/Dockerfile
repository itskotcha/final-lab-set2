FROM nginx:1.25-alpine

COPY index.html   /usr/share/nginx/html/index.html
COPY profile.html /usr/share/nginx/html/profile.html
COPY config.js    /usr/share/nginx/html/config.js
COPY nginx.conf   /etc/nginx/conf.d/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
