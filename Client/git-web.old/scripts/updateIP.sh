#!/bin/sh

# Save Original Working Directory
WD=`pwd` 

# Run and store data for IP
IP=`ip a | grep "/24" | awk '{print $2}' | sed 's/\/24//g'`

# Copy File into Modifying Directory
cp ./src/web-app.js ./scripts/modifyData/in.txt

# Obtain Line number for IP
LINE=`cat ./scripts/modifyData/in.txt | grep -n "IP =" | sed 's/.*\([0-9]:\).*/\1/' | sed 's/://g'`

# Run C++ Program to Modify the IP :)
cd ./scripts/modifyData
chmod +x ./a.out
./a.out $LINE "const IP = '$IP';"

# Return to working directory
cd $WD
cp ./scripts/modifyData/out.txt ./src/web-app.js

# Clean up Files
rm ./scripts/modifyData/*.txt
