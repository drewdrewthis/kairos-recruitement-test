#!/bin/bash

# To use this script, you would need to save it into a file (for instance, copy_json_files.sh), then give it execute permissions using the chmod command:

# bash
# Copy code
# chmod +x scripts/copy_generated_abis.sh


###################################

# Description:
# This script is designed to find all JSON files recursively in the directory '/contracts/out/' 
# and copy them to '/frontend-next/src/__generated/contracts'. 
# If the destination directory doesn't exist, the script will create it. 



# Define source and target directories
source_dir="./contracts/out"
target_dir="./frontend-next/src/__generated/contracts"

# Check if the source directory exists
if [ ! -d "$source_dir" ]; then
    echo "Source directory $source_dir does not exist. Please check and try again."
    exit 1
fi

# Check if the target directory exists. If not, create it.
if [ ! -d "$target_dir" ]; then
    echo "Target directory $target_dir does not exist. Creating now..."
    mkdir -p "$target_dir"
    # Check if the directory was created successfully
    if [ $? -ne 0 ]; then
        echo "Failed to create target directory $target_dir. Please check permissions and try again."
        exit 1
    fi
fi

# Use the find command to locate all JSON files in the source directory, and copy them to the target directory
find "$source_dir" -name "*.json" -exec cp -R {} "$target_dir" \;

# Check if the copy operation was successful
if [ $? -ne 0 ]; then
    echo "An error occurred during the file copying process. Please check permissions and try again."
    exit 1
else
    echo "All JSON files have been successfully copied from $source_dir to $target_dir."
fi
