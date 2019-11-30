docker stop lighting
docker rm lighting
docker build -t root/lighting-app .
docker run --name lighting --restart always -p 49161:8000 -d root/lighting-app

