#! /bin/bash

echo "Starting Web-Server..."

# Run the Git-Web Server
cd /home/webadmin/documents/git-web
#$(nohup npm run start-server > /tmp/git-server.log >&1)& # No nohup.out

$(nohup /home/webadmin/bin/node /home/webadmin/documents/git-web/src/server.js > /tmp/git-server.log >&1)& # No nohup.out
