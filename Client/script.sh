#!/bin/sh

# Setup Users
echo "Setting users up"
adduser -D webadmin
usermod -p $WEBADMIN_PASS webadmin

# Clear Variables
unset WEBADMIN_PASS


# DIR VARIABLES
GIT_WEB="webadmin/git-web"

# Run Web Server
cp $GIT_WEB/dist/* /var/www/localhost/htdocs/ -r
httpd
tail -f /var/log/apache2/access.log
