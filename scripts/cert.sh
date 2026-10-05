#!/bin/sh
# Generates a self-signed certificate for this machine's LAN address so other
# devices can open Proxima over HTTPS (required for microphone access).
# Each device will warn once about the certificate; accept it to continue.
set -e

ip="${1:-$(ipconfig getifaddr en0 2>/dev/null || hostname -I 2>/dev/null | cut -d' ' -f1)}"
if [ -z "$ip" ]; then
	echo "Could not detect a LAN IP. Pass it explicitly: pnpm cert 192.168.1.20" >&2
	exit 1
fi

mkdir -p certs
openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
	-keyout certs/key.pem -out certs/cert.pem \
	-subj "/CN=proxima" \
	-addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:$ip" 2>/dev/null

echo "Wrote certs/ for localhost and $ip"
