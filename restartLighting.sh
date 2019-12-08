#! /bin/bash
cp ../.env .

echo "Pulling the update"
git pull
echo "Stopping existing continer"
docker stop lighting
echo "Removing existing container so only 1 always restarts"
docker rm lighting
echo "Building the new image"
docker build -t root/lighting-app .
echo "Running the new container with the new image"
docker run --name lighting --restart always -p 49161:8000 -d root/lighting-app
echo ""
echo "JOB DONE"
echo ""
