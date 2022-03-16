# TypeScript NodeJS API

![npm Version](https://badge.fury.io/js/npm.svg)
![Build Status](https://github.com/sds/mock_redis/actions/workflows/tests.yml/badge.svg)

NodeJS API using Typescript that receives any JSON request in the POST endpoint /track and saves it in a log file. 
If request contains a numeric count parameter saves it in a Redis Cache Database incrementing the actual value if exists.
It provides also a GET /count endpoint that returns a JSON with the actual count value in Redis.

## Requirements
- Docker
- docker-compose

## Versions
- Node 17
- Redis 5

## Getting Started

```
# run in dev mode on port 3000
docker-compose up
mv .env.template .env
```

## Endpoints

* POST /track:
Request:
`
{
    "test": "test",
    "count": 1
}
`

* GET /count:
Response:
`
{
    "count": 0
}
`

## Running tests
```
# run unit tests
npm run test
```
