#!/bin/sh
curl http://localhost:8080/graphql \
  -F operations='{ "query": "mutation ($file: Upload!) { uploadFile(file: $file) { url filename mimetype encoding } }", "variables": { "file": null } }' \
  -F map='{ "0": ["variables.file"] }' \
  -F 0=@$1
  
