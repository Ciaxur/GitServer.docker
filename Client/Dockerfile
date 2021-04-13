FROM alpine:latest

# Setup Environment Proxy & Install Packges
ARG HTTP_PROXY
RUN apk add nodejs npm apache2 shadow


# Copy Required Files
COPY ./git-web /home/webadmin/git-web
COPY ./script.sh /home/
WORKDIR /home

# Configure NPM Proxy and Install Node Packges
# Build Git-Web
RUN echo "Configuring NPM Proxy..." && \
	npm config set proxy "$HTTP_PROXY" && \ 
	echo "Installing NPM Packages..." && \
	cd ./webadmin/git-web && npm i && \
	echo "Running React Web App..." && \
	npm run build

# Explicitly Expose HTTP Port
EXPOSE 80

USER root
ENTRYPOINT ["/bin/sh", "./script.sh"]