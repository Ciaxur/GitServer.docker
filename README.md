# Simple-Git-Server
Quick, Simple, and Easy Git-Server running in Docker.

## Overview
The Git Server will run locally, exposed to `Port 80` and `Port 3000`.

`Port 22` is also exposed for quick SSH-ing into the running Container remotely.

## Setup
Building and Setting up the Git-Server using **Make**
```bash
make build  # Builds the Image, tagging as 'git-server'
make run    # Runs a Container name 'git-server' and places you into the Shell
# Ctrl+p+q escapes the Container, leaving it running
```

Building and Setting up the Git-Server using **docker** CLI
```bash
docker build . -t git-server    # Builds the Image, tagging as 'git-server'
docker run --name=git-server -it \
            -p 80:80 -p 3000:3000 -p 22:22 \        # Expose required Ports
            -v ~/Shared:/home/git/repositories \    # Shares Directory with Container, HAS to be Absolute Path!
            git-server                              # Image Name to Run
```

---
### License
Licensed under the [MIT License](LICENSE).
