FROM ohif/viewer:v3.8.16.10895 as builder

FROM openresty/openresty:alpine-fat

RUN mkdir /var/log/nginx
RUN apk add --no-cache openssl
RUN apk add --no-cache openssl-dev
RUN apk add --no-cache git
RUN apk add --no-cache gcc

RUN luarocks install lua-resty-jwt
RUN luarocks install lua-resty-session
RUN luarocks install lua-resty-http
#RUN luarocks install luacrypto
RUN luarocks install lua-resty-openidc

# Copy build output to image
COPY --from=builder /usr/share/nginx/html /var/www/html

ENTRYPOINT ["/usr/local/openresty/nginx/sbin/nginx", "-g", "daemon off;"]
