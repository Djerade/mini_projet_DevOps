#!/bin/bash
# Script to create SonarQube database in PostgreSQL

echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Try to create the database
docker compose exec -T database psql -U postgres -c "CREATE DATABASE sonarqube;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database 'sonarqube' created successfully"
else
    echo "⚠️  Database 'sonarqube' might already exist or PostgreSQL is not ready yet"
    # Check if database exists
    docker compose exec -T database psql -U postgres -lqt | cut -d \| -f 1 | grep -qw sonarqube
    if [ $? -eq 0 ]; then
        echo "✅ Database 'sonarqube' already exists"
    else
        echo "❌ Failed to create database. Please check PostgreSQL logs"
    fi
fi

