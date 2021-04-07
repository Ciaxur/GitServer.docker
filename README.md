# Git-Server.docker 🐋
Quick, Simple, and Easy Git-Server running in a Docker Container.

## Overview 🎊
The Git Server will run locally, exposed to `Port 80` and `Port 3000`.
`Port 22` is also exposed for SSH Cloning from the running Container.

## Setup 🔧
Prior to starting the services, configure the [docker-compose.yaml](docker-compose.yaml) file to your liking.

Most notible Modifications:
- `WEBADMIN_PASS`: For both **git-web** and **git-server**. The webadmin Encrypted Password
- `SERVER_PASS`: For **git-server**. The webadmin Encrypted Password

**IMPORTANT**: In order to generate an encrypted password hash, run `openssl passwd -salt xyz -6 123`, with your own `hash (xyz)` and `password (123)`. Paste with result into the [docker-compose.yaml](docker-compose.yaml) file with an additional '$' for every '$', like the example demonstrates.


## Build & Run 📦
`Docker-Compose` is required to get started.
```bash
docker-compose up
```

## Usage

**View / Add Repository**

In order to view or add a new repository, go to `localhost:8080` on your favorite browser.


**Cloning Repository**

After creating a repository or clicking on the repository that will be cloned on `localhost:80`, an SSH link will be provided. Copy the link and run `git clone` to clone the repository.


---
### License
Licensed under the [MIT License](LICENSE).
