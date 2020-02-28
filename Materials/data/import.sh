#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
mongoimport --db materials --collection units --file ${DIR}/units.json --drop --username root --password example --authenticationDatabase admin
mongoimport --db materials --collection materials --file ${DIR}/materials.json --drop --username root --password example --authenticationDatabase admin