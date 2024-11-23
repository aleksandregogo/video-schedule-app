#!/bin/bash

# Define base directory
BASE_DIR="./Certs"
ROOT_CA_DIR="$BASE_DIR/Root"
SERVER_DIR="$BASE_DIR/Server"
CLIENT_DIR="$BASE_DIR/Client"

# Create base directory and certificate subdirectories
echo "Creating directories..."
mkdir -p "$ROOT_CA_DIR" "$SERVER_DIR" "$CLIENT_DIR"

# Set open permissions for directories
chmod 755 "$BASE_DIR" "$ROOT_CA_DIR" "$SERVER_DIR" "$CLIENT_DIR"

# Function to generate certificates
generate_certificates() {
  echo "Generating Root CA..."
  # Generate Root CA key and certificate
  openssl genrsa -out "$ROOT_CA_DIR/ca.key" 2048
  openssl req -x509 -new -nodes -key "$ROOT_CA_DIR/ca.key" -sha256 -days 3650 \
      -out "$ROOT_CA_DIR/ca.crt" \
      -subj "/C=US/ST=ExampleState/L=ExampleCity/O=ExampleOrg/OU=ExampleUnit/CN=ExampleCA"

  # Set open permissions for Root CA files
  chmod 644 "$ROOT_CA_DIR/ca.key" "$ROOT_CA_DIR/ca.crt"

  echo "Generating Server Certificate..."
  # Generate Server key
  openssl genrsa -out "$SERVER_DIR/server.key" 2048

  # Create Server CSR
  openssl req -new -key "$SERVER_DIR/server.key" -out "$SERVER_DIR/server.csr" \
      -subj "/C=US/ST=ExampleState/L=ExampleCity/O=ExampleOrg/OU=ExampleUnit/CN=localhost"

  # Create SAN configuration for Server
  cat > "$SERVER_DIR/server-san.cnf" <<EOL
[req]
distinguished_name = req_distinguished_name
req_extensions = req_ext
prompt = no

[req_distinguished_name]
CN = localhost

[req_ext]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
EOL

  # Sign Server Certificate with Root CA
  openssl x509 -req -in "$SERVER_DIR/server.csr" -CA "$ROOT_CA_DIR/ca.crt" -CAkey "$ROOT_CA_DIR/ca.key" -CAcreateserial \
      -out "$SERVER_DIR/server.crt" -days 365 -sha256 -extfile "$SERVER_DIR/server-san.cnf" -extensions req_ext

  # Set open permissions for Server files
  chmod 644 "$SERVER_DIR/server.key" "$SERVER_DIR/server.csr" "$SERVER_DIR/server.crt" "$SERVER_DIR/server-san.cnf"

  echo "Generating Client Certificate..."
  # Generate Client key
  openssl genrsa -out "$CLIENT_DIR/client.key" 2048

  # Create Client CSR
  openssl req -new -key "$CLIENT_DIR/client.key" -out "$CLIENT_DIR/client.csr" \
      -subj "/C=US/ST=ExampleState/L=ExampleCity/O=ExampleOrg/OU=ExampleUnit/CN=client"

  # Sign Client Certificate with Root CA
  openssl x509 -req -in "$CLIENT_DIR/client.csr" -CA "$ROOT_CA_DIR/ca.crt" -CAkey "$ROOT_CA_DIR/ca.key" -CAcreateserial \
      -out "$CLIENT_DIR/client.crt" -days 365 -sha256

  # Set open permissions for Client files
  chmod 644 "$CLIENT_DIR/client.key" "$CLIENT_DIR/client.csr" "$CLIENT_DIR/client.crt"

  echo "Certificates generated successfully!"
  echo "Directory structure:"
  echo "$ROOT_CA_DIR (Root CA)"
  echo "$SERVER_DIR (Server Certificates)"
  echo "$CLIENT_DIR (Client Certificates)"
}

# Start the certificate generation process
generate_certificates
