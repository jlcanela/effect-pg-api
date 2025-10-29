
```
podman exec -it effect-api-postgres mkdir -p /usr/local/share/postgresql/tsearch_data
podman cp ./postgres/unaccent_custom.rules effect-api-postgres:/usr/local/share/postgresql/tsearch_data/unaccent_custom.rules
podman exec -it effect-api-postgres ls -l /usr/local/share/postgresql/tsearch_data
```
