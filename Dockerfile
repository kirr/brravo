FROM ubuntu:16.04

RUN apt-get update \
  && apt-get install --no-install-recommends -y \
       telnet \
       nginx \
       htop \
       supervisor \
       python3-pip \
       python3-setuptools \
       vim-tiny \
       lsof

RUN pip3 install -U pip==19.3.1

COPY ./conf/nginx/nginx.conf /etc/nginx/
COPY ./conf/nginx/conf.d /etc/nginx/conf.d
COPY ./conf/supervisor/* /etc/supervisor/conf.d/
COPY ./frontend/build /sites/frontend
COPY ./frontend/build /sites/frontend
COPY ./backend /flask

RUN pip3 install -r /flask/requirements.txt

RUN mkdir -p /var/log/www/brravo
RUN python3 /flask/tools/collect_static.py /sites/admin

# let supervisord to start in a foreground
RUN sed -i '/\[supervisord\]/a nodaemon=true' /etc/supervisor/supervisord.conf

#CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
CMD ["supervisord", "-n"]
