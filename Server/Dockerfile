FROM alpine:latest

# Setup Environment Install Packages
RUN \
	echo "Installing Alpine Packages..." && \
	apk upgrade --update-cache --available && \
	apk add git nodejs npm openssh openssl shadow

# Copy Required Files
COPY ./git-server /home/webadmin/git-server
COPY ./script.sh /home/
COPY ./git /home
WORKDIR /home

# Configure NPM Proxy and Install Node Packges
# Build Git-Web
RUN echo "Installing NPM Packages..." && \
	cd ./webadmin/git-server && npm i

# Explicitly Expose ExpressJS Port
EXPOSE 3000 22

USER root
ENTRYPOINT ["/bin/sh", "./script.sh"]