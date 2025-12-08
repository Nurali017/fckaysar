#!/bin/bash
# FC Kaisar - Server Setup Script for Debian 12
# Run as root: sudo bash server-setup.sh

set -e

echo "=========================================="
echo "FC Kaisar - Server Setup"
echo "Debian 12 | 2 CPU | 2 GB RAM | 40 GB disk"
echo "=========================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root (sudo)"
    exit 1
fi

# ============================================
# 1. System Update
# ============================================
log_info "Updating system packages..."
apt update && apt upgrade -y

# ============================================
# 2. Install Essential Packages
# ============================================
log_info "Installing essential packages..."
apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    htop \
    vim \
    ufw \
    fail2ban \
    unattended-upgrades

# ============================================
# 3. Configure Swap (critical for 2GB RAM)
# ============================================
log_info "Configuring swap..."
SWAPFILE=/swapfile
SWAP_SIZE=2G

if [ ! -f "$SWAPFILE" ]; then
    fallocate -l $SWAP_SIZE $SWAPFILE
    chmod 600 $SWAPFILE
    mkswap $SWAPFILE
    swapon $SWAPFILE
    echo "$SWAPFILE none swap sw 0 0" >> /etc/fstab

    # Optimize swap settings
    echo "vm.swappiness=10" >> /etc/sysctl.conf
    echo "vm.vfs_cache_pressure=50" >> /etc/sysctl.conf
    sysctl -p

    log_info "Swap configured: $SWAP_SIZE"
else
    log_warn "Swap file already exists"
fi

# ============================================
# 4. Install Docker
# ============================================
log_info "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
    log_info "Docker installed successfully"
else
    log_warn "Docker already installed"
fi

# ============================================
# 5. Configure Docker for low memory
# ============================================
log_info "Configuring Docker..."
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << 'EOF'
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    },
    "storage-driver": "overlay2",
    "live-restore": true
}
EOF
systemctl restart docker

# ============================================
# 6. Configure Firewall (UFW)
# ============================================
log_info "Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
log_info "Firewall configured (SSH, HTTP, HTTPS)"

# ============================================
# 7. Configure Fail2Ban
# ============================================
log_info "Configuring Fail2Ban..."
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
EOF
systemctl restart fail2ban
systemctl enable fail2ban

# ============================================
# 8. Create Application Directory
# ============================================
log_info "Creating application directory..."
mkdir -p /opt/kaisar/{nginx/conf.d,certbot/{www,conf},backups,logs}

# ============================================
# 9. Create deploy user
# ============================================
if ! id "deploy" &>/dev/null; then
    useradd -m -s /bin/bash deploy
    usermod -aG docker deploy
    mkdir -p /home/deploy/.ssh
    chmod 700 /home/deploy/.ssh
    chown -R deploy:deploy /home/deploy/.ssh
    chown -R deploy:deploy /opt/kaisar
    log_info "User 'deploy' created"
else
    log_warn "User 'deploy' already exists"
fi

# ============================================
# 10. Summary
# ============================================
echo ""
echo "=========================================="
echo "Server Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Add SSH public key to /home/deploy/.ssh/authorized_keys"
echo "2. Create /opt/kaisar/.env with secrets"
echo "3. Run ssl-init.sh to get SSL certificate"
echo "4. Deploy with: docker compose -f docker-compose.prod.yml up -d"
echo ""
echo "Server info:"
echo "  - Swap: $SWAP_SIZE"
echo "  - Docker: $(docker --version)"
echo "  - Firewall: UFW enabled"
echo ""
free -h
