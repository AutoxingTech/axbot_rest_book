FROM nginx:1.21

# Bundle app source
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docs/.vuepress/dist /usr/share/nginx/html/axbot_rest_book

EXPOSE 80
