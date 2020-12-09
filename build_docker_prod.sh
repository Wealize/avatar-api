#!/bin/bash
# exit when any command fails
set -e

if [ -z "$DOCKER_TAG_NAME" ]
then
    echo "You need to set the DOCKER_TAG_NAME envvar"
    exit 1
fi

ECR_REPOSITORY=527196448735.dkr.ecr.eu-central-1.amazonaws.com

if [-z "$LOCAL_IMAGE"]
then
    ECR_REPOSITORY_IMAGE=$ECR_REPOSITORY/avatars
else
    ECR_REPOSITORY_IMAGE=avatars
fi

docker build \
    --build-arg AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
    --build-arg AWS_SECRET=${AWS_SECRET} \
    --build-arg AWS_STORAGE_BUCKET_NAME=${AWS_STORAGE_BUCKET_NAME} \
    --build-arg AWS_REGION=${AWS_REGION} \
    -t $ECR_REPOSITORY_IMAGE:$DOCKER_TAG_NAME \
    -f Dockerfile.prod .

if [ -z "$RUN_ON_CI"]
then
    aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin $ECR_REPOSITORY
    docker push $ECR_REPOSITORY_IMAGE:$DOCKER_TAG_NAME
fi
