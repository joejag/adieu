#!/bin/bash
set -eu

(cd back && npm run build)
(cd front && npm run build)
(cd infra && cdk deploy AdieuAPIStack AdieuWebStack --require-approval never)
