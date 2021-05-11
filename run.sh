#!/bin/bash
set -eu

export CLIENT_ID="$(aws ssm get-parameter --name '/adieu/client-id' --query 'Parameter.Value' --output text)"
export CLIENT_SECRET="$(aws ssm get-parameter --name '/adieu/client-secret' --query 'Parameter.Value' --output text)"

export SESSIONS_TABLE_NAME="sessions"
export ADIEU_HOMEPAGE="http://localhost:3000"
export CLIENT_REDIRECT="http://localhost:3000/api/callback"

function go_dynamo() {
    # docker run -p 8000:8000 amazon/dynamodb-local  -jar DynamoDBLocal.jar -sharedDb
    aws dynamodb create-table \
        --table-name sessions \
        --attribute-definitions AttributeName=sessionId,AttributeType=S \
        --key-schema AttributeName=sessionId,KeyType=HASH \
        --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --endpoint-url http://localhost:8000
}

# (cd front && npm start &)
(cd back/local && npm start)