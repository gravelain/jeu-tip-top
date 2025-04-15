#!/bin/bash

# Configuration
BACKUP_DIR="/backups"
MONGO_CONTAINER="tip_top_mongodb"
TIMESTAMP=$(date +"%F-%H-%M-%S")
BACKUP_NAME="mongodb-backup-$TIMESTAMP.tar.gz"

# Création du répertoire de backup s'il n'existe pas
mkdir -p $BACKUP_DIR

# Dump MongoDB
docker exec $MONGO_CONTAINER mongodump --archive=/data/db/dump.archive

# Sauvegarde des fichiers essentiels
tar -czvf $BACKUP_DIR/$BACKUP_NAME /data/db/dump.archive

echo "Backup réalisé : $BACKUP_NAME"
