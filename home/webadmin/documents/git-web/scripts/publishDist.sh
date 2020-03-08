#!/bin/sh

DIST_DIR="./dist"
APACHE_HTTP="/var/www/html"

# Figure out where Dist is
# Check if Dist is not in Current Directory
if [ ! -d "$DIST_DIR" ]; then      # Dist not in Current Directory
    DIST_DIR="../dist"

    # Check on last time
    if [ ! -d "$DIST_DIR" ]; then
        echo "Please run this script from Project Directory"
        exit 1
    fi
fi


# Publish "dist" to apache server
echo "Publishing Distrubution Directory to Apache Server..."
sudo cp -r $DIST_DIR/* $APACHE_HTTP/
