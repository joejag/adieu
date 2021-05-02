(cd front && npm run build)
(cd infra && cdk deploy AdieuWebStack --require-approval never)
