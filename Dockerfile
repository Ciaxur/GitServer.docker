FROM alpine:latest

# Setup Environment Proxy & Install Packges
ENV HTTP_PROXY=""
RUN apk add git nodejs npm apache2 openssh


# Copy Required Files
COPY ./home /home
COPY ./script.sh /home
WORKDIR /home

# Configure NPM Proxy and Install Node Packges
# Build Git-Web
RUN npm config set proxy "$HTTP_PROXY" && \ 
	cd ./webadmin/documents/git-web && npm i && \
	npm run build-web

# Expose HTTP and ExpressJS
EXPOSE 80 3000

ENTRYPOINT ["/bin/sh", "./script.sh"]