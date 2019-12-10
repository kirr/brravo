#!/bin/bash
DOCKER_IMAGE=cr.yandex/crpb7dk0spagmsiikn2c/brravo:latest

docker pull $DOCKER_IMAGE
docker stop brravo
docker container prune
docker run --mount type=volume,target=/data,volume-opt=device=/data,volume-opt=type=none,volume-opt=o=bind -d --name brravo --restart always -p 80:80 $DOCKER_IMAGE
