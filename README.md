# OHIF Viewer with OpenID-Protected PACS Server (Orthanc)

This project implements a secure medical imaging viewer setup that protects the PACS server using OpenID Connect authentication, compatible with corporate SSO systems. The solution uses OpenResty (nginx + Lua) and Keycloak for authentication, leveraging the [lua-resty-openidc](https://github.com/zmartzone/lua-resty-openidc) library.

## Features

- **Single-host deployment** - Eliminates CORS issues by proxying all services through one domain
- **Corporate SSO integration** - Compatible with existing OpenID Connect providers
- **Streamlined service proxying through OpenResty** - High-performance nginx + Lua platform
- **Secure authentication** - Protects PACS server access with session-based authentication
- **Medical imaging viewer** - Full-featured OHIF viewer with DICOMWeb support
- **PACS server** - Orthanc with DICOMWeb API for storing and retrieving medical images

## Architecture

### CORS Handling
All services are proxied through a single host (the `viewer` container), which combines OpenResty and the OHIF viewer. This approach completely eliminates CORS-related issues by serving all services under one domain.

### Authentication Configuration
Session timing can be configured in the nginx configuration:
- `session.cookie.renew` - Sets session renewal timing
- `session.cookie.lifetime` - Sets total session duration

To configure a custom cookie domain:
```lua
local session_opts = { cookie = { domain = ".mydomain.com" } }
```

## Deployment

### Quick Start
```bash
docker-compose up --build
```

**Note:** Initial startup may take 1-2 minutes while Keycloak initializes its database. If startup appears to hang, check the logs:
```bash
docker-compose logs -f
```

If needed, restart the entire stack:
```bash
docker-compose restart
```

### Keycloak Configuration

1. Access the Keycloak admin console at http://localhost:3333 (credentials in docker-compose.yml)
2. Create a new realm named `imagingrealm`:
   - Use the realm dropdown (top left)
   - Select "Add realm"
3. Create a client named `imaging` with the following settings:
   - Redirect URL: `*`
   - Access Type: `confidential`
   - Web Origins: `+`
4. Copy the client secret from Keycloak to `openid-keycloak-secrets.env`:
   - Set as `OPENID_CLIENT_SECRET`
5. Create a user account and set their password in the "Credentials" tab
6. Restart nginx to apply the new configuration:
   ```bash
   docker-compose stop viewer
   docker-compose up -d
   ```

## Access Points

- **OHIF Viewer**: http://localhost/
  - Main viewer interface connected to Orthanc
- **Admin Console**: http://localhost/pacs-admin/
  - Use to upload DICOM files (upload button in top right corner)
- **API Example**: http://localhost/pacs/series
  - Demonstrates Orthanc API access

## Security Notes

### SSL Configuration
A development SSL key is included in this repository. **DO NOT USE IN PRODUCTION**.

For production, generate a new SSL key pair:
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginxenv/ssl/nginx.key \
    -out nginxenv/ssl/nginx.crt
```