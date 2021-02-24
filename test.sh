CONTAINER_ID=$(docker run -p 5400:5432 -e POSTGRES_USER=test -e POSTGRES_PASSWORD=test -d postgres:alpine)
echo "Running PG Container: $CONTAINER_ID"

# waits
sleep 3  

# run db tests
export PG_URL=postgres://test:test@localhost:5400/test
PG_URL=$PG_URL npm run test

# kill database containers
echo "Killing PG Container: $CONTAINER_ID"
docker rm -f $CONTAINER_ID