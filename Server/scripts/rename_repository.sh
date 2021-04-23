# Statuses:
#   - 0 = Success, No Errors
#   - 1 = ERROR: No Parameters Given (2 Expected: old_name new_name)
#   - 2 = ERROR: Repository not Found
#
# Description:
#   - Script that renames given repository
#
# Author:           Omar Omar
# Date Created:     April 19, 2021
# Last Modified:    April 19, 2021


# Have a Main Directory to Work with
REPO_DIR="/home/git/"

# Change into Repo Directory
cd $REPO_DIR

# Make sure Expected parameters are given
if [ $# -gt 1 ];then
    # Add a .git Extension to Repo Names
    OLD_NAME="$1.git"
    NEW_NAME="$2.git"
    
    # Try to rename Repository
    echo "Attempting to rename repository $OLD_NAME -> $NEW_NAME"
    mv $OLD_NAME $NEW_NAME 2> /dev/null

    # Validate Rename Status
    if [ $? != 0 ]; then
        echo "ERROR: Repository could not be renamed!"
        echo "Status: 2"
        exit 2
    fi
    
    # Exit Success
    echo "Repository Removed Renamed!"
    echo "Status: 0"                        # Success!
    exit 0

# No Repository Parameter Given
else
    echo "No Repository Name Given!"
    echo "Status: 1"                        # ERROR: No Param
    exit 1
fi

