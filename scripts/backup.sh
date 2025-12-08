#!/bin/bash
# FC Kaisar - Backup Script
# Backs up MongoDB and media files

set -e

BACKUP_DIR="/opt/kaisar/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

echo "=========================================="
echo "FC Kaisar - Backup"
echo "Date: $DATE"
echo "=========================================="

# Load environment variables
if [ -f /opt/kaisar/.env ]; then
    export $(grep -v '^#' /opt/kaisar/.env | xargs)
fi

mkdir -p "$BACKUP_DIR"

# Backup MongoDB
echo "Backing up MongoDB..."
docker exec kaisar-mongo mongodump \
    --username "${MONGO_ROOT_USER:-admin}" \
    --password "${MONGO_ROOT_PASSWORD}" \
    --authenticationDatabase admin \
    --out "/backups/mongo_$DATE"

# Compress MongoDB backup
cd "$BACKUP_DIR"
if [ -d "mongo_$DATE" ]; then
    tar -czf "mongo_$DATE.tar.gz" "mongo_$DATE"
    rm -rf "mongo_$DATE"
    echo "MongoDB backup: mongo_$DATE.tar.gz"
fi

# Backup media files
echo "Backing up media files..."
docker run --rm \
    -v kaisar_project_cms_media:/media:ro \
    -v "$BACKUP_DIR":/backup \
    alpine tar -czf "/backup/media_$DATE.tar.gz" -C /media . 2>/dev/null || \
docker run --rm \
    -v kaysar_project_cms_media:/media:ro \
    -v "$BACKUP_DIR":/backup \
    alpine tar -czf "/backup/media_$DATE.tar.gz" -C /media . 2>/dev/null || \
echo "Warning: Could not backup media (volume not found)"

# Cleanup old backups
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo ""
echo "=========================================="
echo "Backup Complete!"
echo "=========================================="
ls -lh "$BACKUP_DIR"
