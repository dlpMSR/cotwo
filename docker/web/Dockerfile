FROM nginx:stable

COPY ./cotwo.conf /etc/nginx/conf.d/cotwo.conf
COPY ./uwsgi_params /etc/nginx/uwsgi_params
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf_
