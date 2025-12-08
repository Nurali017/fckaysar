#!/bin/bash
# FC Kaisar - Initial SSL Certificate Setup
# Run after server-setup.sh

set -e

DOMAIN="kaysar.kz"
EMAIL="${1:-admin@kaysar.kz}"

echo "=========================================="
echo "FC Kaisar - SSL Certificate Setup"
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo "=========================================="

cd /opt/kaisar

# Create temporary nginx config without SSL
echo "Creating temporary nginx config for ACME challenge..."
mkdir -p nginx/conf.d

cat > nginx/conf.d/kaysar.conf << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name kaysar.kz www.kaysar.kz;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'SSL setup in progress...';
        add_header Content-Type text/plain;
    }
}
EOF

# Start nginx for ACME challenge
echo "Starting nginx..."
docker compose -f docker-compose.prod.yml up -d nginx

sleep 5

# Get certificate
echo "Obtaining SSL certificate..."
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path /var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# Check if certificate was obtained
if [ -f "certbot/conf/live/$DOMAIN/fullchain.pem" ]; then
    echo ""
    echo "=========================================="
    echo "SSL certificate obtained successfully!"
    echo "=========================================="
    echo ""
    echo "Certificate location:"
    echo "  - /opt/kaisar/certbot/conf/live/$DOMAIN/"
    echo ""
    echo "Now you can deploy the full stack:"
    echo "  docker compose -f docker-compose.prod.yml up -d"
else
    echo ""
    echo "=========================================="
    echo "ERROR: Failed to obtain SSL certificate"
    echo "=========================================="
    echo ""
    echo "Make sure:"
    echo "  1. DNS A records point to this server"
    echo "  2. Ports 80 and 443 are open"
    echo "  3. Domain is accessible from internet"
    exit 1
fi
