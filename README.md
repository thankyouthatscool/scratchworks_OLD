# scratchworks

## Bash Scripts

### Restarting the server

```bash
ssh -i key ${USERNAME}@${SERVER_HOST} "
docker pull ozahnitko/scratchworks-backend-server:dev-latest &&
docker stop scratchworks-backend-server &&
docker rm scratchworks-backend-server &&
docker run -d --name scratchworks-backend-server --network container:postgres ozahnitko/scratchworks-backend-server:dev-latest &&
docker image prune --force"
```

### Updating the repository

```bash
ssh -i key ${USERNAME}@${SERVER_HOST} "
cd source/scratchworks &&
git pull"
```
