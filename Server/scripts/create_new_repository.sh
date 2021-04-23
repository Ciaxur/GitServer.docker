# Statuses:
#   - 0 = Success, No Errors
#   - 1 = ERROR: No Parameter Given
#   - 2 = ERROR: Duplicate Repository
#
# Description:
#   - Script that creates and initializes an empty
#       repository with name given by first Parameter
#
# Author:           Omar Omar
# Date Created:     July 10, 2019
# Last Modified:    July 12, 2019


# Have a Main Directory to Work with
REPO_DIR="/home/git"
SCRIPTS_DIR="/home/scripts"

# Change into Repo Directory
cd $REPO_DIR

# Make sure Repo Name is given
if [ ! -z "$1" ];then
    # Add a .git Extension to Repo
    REPO_NAME="$1.git"
    
    # Check for Duplicate Files
    # Check for Duplicates | Redirect stderr to null
    RESULT=`find $REPO_DIR/$REPO_NAME -maxdepth 0 2>/dev/null`


    # Terminate Script if Dup Found
    if [ "$RESULT" == "$REPO_DIR/$REPO_NAME" ]; then
        echo "ERROR: Duplicate Directory!"
        echo "Status: 2"                    # ERROR: Duplicate Repo
        exit 2
    fi

    # Proceed with Creating the Repo
    echo "Creating Repository '$REPO_NAME'..."
    mkdir "$REPO_NAME" || exit 1    # Duplicate found!
    
    # Initialize the Repo
    cd $REPO_NAME
    git init --bare &>/dev/null     # No Output stdout stderr

    # Set Repo Permissions
    cd ../
    echo "Setting Permissions..."
    chgrp -R git ./$REPO_NAME
    chmod -R g+rw ./$REPO_NAME
    chown -R git ./$REPO_NAME
   
    # Repository Success
    echo "Repository Created Successfuly!"
    echo "Status: 0"                        # Success!

    # NEW: Initialize New Repository
    sh $SCRIPTS_DIR/initialize_repo.sh $REPO_DIR/$REPO_NAME

    # Set Permissions
    echo "Finalizing Permissions..."
    chgrp -R git ./$REPO_NAME
    chmod -R g+rw ./$REPO_NAME
    chown -R git ./$REPO_NAME

    exit 0

# No Repository Parameter Given
else
    echo "No Repository Name Given!"
    echo "Status: 1"                        # ERROR: No Param
    exit 1
fi

