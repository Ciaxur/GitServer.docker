# Statuses:
#   - 0 = Success, No Errors
#   - 1 = ERROR: No Parameter Given
#   - 2 = ERROR: Repository not Found
#
# Description:
#   - Script that finds and deletes given repository
#       from the Repo Directory
#
# Author:           Omar Omar
# Date Created:     July 10, 2019
# Last Modified:    April 19, 2021


# Have a Main Directory to Work with
REPO_DIR="/home/git/"

# Change into Repo Directory
cd $REPO_DIR

# Make sure Repo Name is given
if [ ! -z "$1" ];then
    # Add a .git Extension to Repo
    REPO_NAME="$1.git"
    
    # Look for Repository
    RESULT=`find $REPO_NAME -maxdepth 0 2>/dev/null`    # Check if found | Redirect stderr to null

    # Terminate Script if not Found
    if [ "$RESULT" != "$REPO_NAME" ]; then
        echo "ERROR: Repository not Found!"
        echo "Status: 2"                    # Repository not Found!
        exit 2
    fi

    # Proceed with Removing the Repo
    echo "Removing Repository '$REPO_NAME'..."
    rm -r "$REPO_NAME"
    
    # Exit Success
    echo "Repository Removed Successfuly!"
    echo "Status: 0"                        # Success!
    exit 0

# No Repository Parameter Given
else
    echo "No Repository Name Given!"
    echo "Status: 1"                        # ERROR: No Param
    exit 1
fi

