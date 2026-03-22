FROM ohif/app:v3.12.0 as builder

FROM openresty/openresty:alpine-fat

RUN luarocks install lua-resty-openidc 1.7.6
RUN apk update && apk add git && luarocks install lua-resty-cookie

# Copy build output to image
COPY --from=builder /usr/share/nginx/html /var/www/html

COPY access-auth-include.conf /usr/local/openresty/nginx/conf/access-auth-include.conf
COPY access-check-include.conf /usr/local/openresty/nginx/conf/access-check-include.conf
COPY cors-include.conf /usr/local/openresty/nginx/conf/cors-include.conf

ENTRYPOINT ["/usr/local/openresty/nginx/sbin/nginx", "-g", "daemon off;"]
