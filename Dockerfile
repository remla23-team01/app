FROM nginx
WORKDIR /root
RUN apt update
RUN apt -y install nodejs npm
ENV PREDICT_PATH="/predict"
ENV METRICS_PATH="/metrics"
ENV CHECK_PREDICT_PATH="/checkPrediction"
ENV BACKEND_URL="http://localhost:8080"
COPY ./public /root/public
COPY ./src /root/src
COPY package.json /root
COPY nginx_setup_file.conf /root/nginx_setup_file.conf
COPY environment_setup.sh /root/environment_setup.sh
RUN chmod +x environment_setup.sh
RUN ./environment_setup.sh
RUN ls
RUN npm install
RUN npm run build-js
RUN mv public/* /usr/share/nginx/html