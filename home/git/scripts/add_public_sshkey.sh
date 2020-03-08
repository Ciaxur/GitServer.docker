#!/bin/sh

# Set Directory of SSH Keys
SSH_DIR="/home/git/.ssh"
AUTH_KEYS="$SSH_DIR/authorized_keys"

# Temporarily change Persmissions
chmod 770 $SSH_DIR
chmod 660 $AUTH_KEYS

# Add the Key
echo $1 >> $AUTH_KEYS

# Reset Permissions
chmod 700 $SSH_DIR
chmod 600 $AUTH_KEYS
