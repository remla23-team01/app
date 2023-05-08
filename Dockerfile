FROM nginx
RUN npm run build-js
COPY public /usr/share/nginx/html