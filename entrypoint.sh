#!/bin/sh

# Check if SSL certificates are mounted
if [ -f "/certs/server-crt.pem" ] && [ -f "/certs/server-key.pem" ]; then
    echo "SSL certificates found. Starting HTTPS server on port 443 and HTTP on port 80..."
    
    # Copy certificates to nginx ssl directory
    cp /certs/server-crt.pem /etc/nginx/ssl/server-crt.pem
    cp /certs/server-key.pem /etc/nginx/ssl/server-key.pem
    
    # Update nginx config to use SSL
    cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen 80;
    server_name _;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name _;
    
    ssl_certificate /etc/nginx/ssl/server-crt.pem;
    ssl_certificate_key /etc/nginx/ssl/server-key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    location / {
        root /usr/share/nginx/html;
        try_files \$uri \$uri/ /index.html;
    }
    
    error_page 404 /index.html;
}
EOF
else
    echo "No SSL certificates found. Starting HTTP server on port 80..."
    
    # Configure HTTP only
    cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen 80;
    server_name _;
    
    location / {
        root /usr/share/nginx/html;
        try_files \$uri \$uri/ /index.html;
    }
    
    error_page 404 /index.html;
}
EOF
fi

# Start nginx
exec nginx -g "daemon off;"
