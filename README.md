# OHIF viewer using PACS Server (orthanc) protected by OpenID

Based on OpenResty (nginx + lua) and Keycloak as OpenID auth.

Use https://github.com/zmartzone/lua-resty-openidc for authentication.

Kind of quick and dirty solution but the main point - it just works 
in contratry to all others that I found so far.

### CORS

Basic idea - we workaround CORS problem proxying all services as endpoints on
one host.
All services are proxed from `viewer` which is actually a OpenResty + OHIV viewer.

This way there is just no CORS problem at all.

Separate nginx in the docker-compose actually is not needed, just for quick experiments.

### Session
Play with session.cookie.renew and session.cookie.lifetime to setup session lifetime.

You can set the cookies domain using authenticate() fourth argument!

    local session_opts = { cookie = { domain = ".mydomain.com" } }

### Start

    docker-compose up --build

Give it some time to start all containers and init KeyCloack DB, first time it could take
up to minute.
There is no special means to sync start so it could stuck, you will see that in logs

    docker-compose logs -f

In this case just restart it

    docker-compose restart

### KeyCloack

To make it work you need this settings in KeyCloack:

0) login to KeyCloack adm console http://localhost/auth/ or http://localhost:3333 (see creds in docker-compose.yml) 
1) Create realm `imagingcloak`
2) Create clients:
   - `nginx`, Redirect URL `http://localhost:3002/*`, access-type: public, WebOrigins *
   - `pacs`, Redirect URL `*`, access-type: confidential, RootURL http://127.0.0.1, BaseUrl /pacs-admin, WebOrigins *
   - `nginx2`, Redirect URL `*`, access-type: public, WebOrigins http://127.0.0.1:4090/*, *
   - `viewer`, Redirect URL `http://localhost*`, access-type: `confidential`, WebOrigins `+`
3) add a secret key from the keycloak user pacs Credentials tab to the `openid-keycloak-secrets.env`
4) add `user`, set password

### Host address

In the /etc/hosts file., please add following (in fact not needed anymore)
As well as some of client settings could be simplified, this is just description of solution that start working

    127.0.0.1       host.docker.internal


### Debugging lefovers

In docker-compose described service `nginx` which is not used anymore, but it could be useful for debugging.
If you want to use it you should copy Keycloak creds also to the `/docker/openresty/nginx.conf`.
There is different resty session so you can use access to `localhost:4090` to drop session on `localhost`.
