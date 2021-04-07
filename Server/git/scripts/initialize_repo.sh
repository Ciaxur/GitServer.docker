#!/bin/sh

# Validate Given Parameter
if [ "$1" = "" ]; then 
    echo "Failed: No Parameter given!"
    exit 1
fi



# Generate Random temp directory
echo "Generating temp files..."
DIR_NAME=`date | md5sum | sed 's/\s.*$//'`
TEMP_DIR='/tmp'
#mkdir -p $TEMP_DIR
cd "$TEMP_DIR"
mkdir -p $DIR_NAME
cd $DIR_NAME

# Clone & Open Given Repository
echo "Cloning Repository..."
git clone $1 "temp_repo" #&>/dev/null
cd "temp_repo"


# Initialize the Repo
echo "Initializing Repository..."


git branch --unset-upstream
touch .gitignore
git add .
git commit -m "Initialized Repository"
git push --set-upstream origin master


git status

# Clean up Temporary file
echo "Cleaning up temp files..."
cd "$TEMP_DIR"
rm -r $DIR_NAME

# Done
echo "Finished Successfuly!"
exit 0
