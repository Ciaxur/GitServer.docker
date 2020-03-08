#!/bin/sh

# Setup Users
adduser git
adduser webadmin

# Git Configuration
git config --global user.name "git-server"
git config --global user.email "root@localhost"

# DIR VARIABLES
GIT_WEB="webadmin/documents/git-web"

# Run Web Server
cp $GIT_WEB/dist/* /var/www/localhost/htdocs/ -r
httpd&

# Init Repos & Copy over Repos
# And setup Permissions
REPO_DIR='/home/git/repositories'
mkdir /repos

echo "Linking Repositories to /repos"
for d in $REPO_DIR/* ; do
	file=`basename $d`

	# Make sure it Exists
	if [ -d "$REPO_DIR/$file" ]; then
		ln -s $d /repos/$file
	
		# Set Permissions
		chgrp -R git $d
		chown -R git $d
	fi
done


# Run Git Server
echo "Starting Web-Server..."
$(nohup node $GIT_WEB/src/server.js > /tmp/git-server.log >&1)&

# Setup sshd
ssh-keygen -f /etc/ssh/ssh_host_rsa_key -N '' -t rsa
ssh-keygen -f /etc/ssh/ssh_host_dsa_key -N '' -t dsa
/usr/sbin/sshd -D&

# Stay in Shell (TESTING)
sh