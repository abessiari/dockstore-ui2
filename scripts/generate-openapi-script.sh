#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

# GENERATOR_VERSION="4.3.0"

rm -Rf src/app/shared/swagger
rm -Rf src/app/shared/openapi

java -jar openapi-generator-cli.jar generate -i ./swagger.yaml -g typescript-angular -o src/app/shared/swagger -c swagger-config.json --skip-validate-spec
java -jar openapi-generator-cli.jar generate -i ./openapi.yaml -g typescript-angular -o src/app/shared/openapi -c swagger-config.json --skip-validate-spec
