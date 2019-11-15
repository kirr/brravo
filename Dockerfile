FROM ubuntu:16.04

RUN apt-get update \
  && apt-get install --no-install-recommends -y \
       telnet \
       nginx \
       htop \
       lsof

COPY ./conf/nginx/nginx.conf /etc/nginx/
COPY ./conf/nginx/conf.d /etc/nginx/conf.d
COPY ./frontend/build /sites/frontend

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
