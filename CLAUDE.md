# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Docker-based medical imaging viewer system that integrates OHIF (Open Health Imaging Foundation) viewer with Orthanc PACS server, protected by OpenID authentication through Keycloak. The architecture eliminates CORS issues by proxying all services through a single OpenResty (nginx + lua) host.

## Development Commands

### Starting the System
```bash
docker-compose up --build
```

### Monitoring Logs
```bash
docker-compose logs -f
```

### Restarting Individual Services
```bash
docker-compose restart viewer
docker-compose stop viewer
docker-compose up -d
```

### SSL Certificate Generation (Production)
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginxenv/ssl/nginx.key \
    -out nginxenv/ssl/nginx.crt
```

## Architecture

### Service Architecture
- **viewer** (ohif-openresty): OpenResty-based container combining OHIF viewer and nginx reverse proxy with OpenID authentication
- **orthanc**: PACS server (jodogne/orthanc-plugins:1.5.6) with DICOMWeb support
- **keycloak**: OpenID Connect provider for authentication
- **postgres**: Database backend for Keycloak

### Network Design
All services communicate through `cloakednet` Docker network. The viewer container acts as the single entry point, proxying requests to backend services to eliminate CORS issues.

### Authentication Flow
- Uses lua-resty-openidc library for OpenID Connect integration
- Protected endpoints use lua access control blocks in nginx configuration
- Two protection levels:
  - `access-auth-include.conf`: Full authentication for admin interfaces
  - `access-check-include.conf`: Access verification for API endpoints

## Key Configuration Files

### Docker Configuration
- `docker-compose.yml`: Service definitions and networking
- `docker/ohif/Dockerfile`: OHIF viewer container build
- `docker/orthanc/orthanc.json`: Orthanc PACS server configuration

### OHIF Configuration
- `docker/ohif/ohif.js`: OHIF viewer configuration mounted as `/var/www/html/app-config.js`
- Configures DICOMWeb endpoints pointing to `/pacs/` proxy paths

### Nginx/OpenResty Configuration
- `docker/ohif/nginx.conf`: Main nginx configuration with lua integration
- `docker/ohif/access-auth-include.conf`: OpenID authentication lua block
- Environment variables for OpenID configuration loaded from `openid-keycloak-secrets.env`

### OpenID Configuration
- `openid-keycloak-secrets.env`: Contains client credentials and discovery endpoint
- Realm: `imagingrealm`
- Client: `imaging` (confidential)

## Service Endpoints

### External Access Points
- OHIF Viewer: `http://localhost/`
- Orthanc Admin: `http://localhost/pacs-admin/` (protected)
- Keycloak Admin: `http://localhost:3333`
- API Access: `http://localhost/pacs/` (protected)

### Internal Service URLs
- Orthanc: `http://orthanc:8042`
- Keycloak: `http://keycloak:8080`
- Postgres: `postgres:5432`

## Development Patterns

### Configuration Changes
- nginx configuration changes require viewer container restart
- OpenID settings are loaded from environment file
- OHIF configuration is volume-mounted for easy development

### Authentication Development
- Session configuration in nginx.conf (lines 75-79)
- Custom session timing via `session.cookie.renew` and `session.cookie.lifetime`
- Lua access control blocks handle OpenID flow

### Volume Mounts
- `./volumes/logs/nginx`: nginx logs
- `./volumes/orthanc-db/`: Orthanc database persistence
- Configuration files are read-only volume mounts

## Security Considerations

- Development SSL key included (DO NOT use in production)
- Default Keycloak credentials in docker-compose.yml
- OpenID client secret in environment file
- Session secret hardcoded in nginx.conf (change for production)