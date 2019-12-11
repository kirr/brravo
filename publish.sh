#!/bin/bash
DOCKER_IMAGE=cr.yandex/crpb7dk0spagmsiikn2c/brravo:latest
cd "$(dirname "$0")"
(cd ./frontend && npm run build) && \
    docker build -t $DOCKER_IMAGE -f Dockerfile . && \
    docker push $DOCKER_IMAGE && \
    scp server_update.sh kirr@84.201.173.241: && \
    ssh -A 84.201.173.241 sudo ./server_update.sh
# yc compute instance update-container --name brravo --container-image $DOCKER_IMAGE
