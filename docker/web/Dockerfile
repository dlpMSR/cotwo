FROM nginx:stable

COPY ./django.conf /etc/nginx/conf.d/django.conf
COPY ./uwsgi_params /etc/nginx/uwsgi_params
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf_
