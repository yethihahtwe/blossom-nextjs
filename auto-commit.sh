#!/bin/bash

# Auto-commit script for Blossom
# This script adds, commits, and pushes changes to GitHub

# Change to project directory
cd /home/yethihahtwe/dev/blossom-nextjs

# Log file for debugging
LOG_FILE="/home/yethihahtwe/dev/blossom-nextjs/auto-commit.log"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log_message "Starting auto-commit process"

# Check if there are any changes to commit
if git diff --quiet && git diff --cached --quiet; then
    log_message "No changes to commit"
    exit 0
fi

# Add all changes
git add .
log_message "Added all changes to staging"

# Commit with timestamp
COMMIT_MESSAGE="Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MESSAGE"

if [ $? -eq 0 ]; then
    log_message "Committed changes: $COMMIT_MESSAGE"
    
    # Push to remote
    git push origin main
    
    if [ $? -eq 0 ]; then
        log_message "Successfully pushed to remote"
    else
        log_message "ERROR: Failed to push to remote"
    fi
else
    log_message "ERROR: Failed to commit changes"
fi

log_message "Auto-commit process completed"
