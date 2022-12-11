# scratchworks

## Bash Scripts

### Restarting the server

```bash
ssh -i box.pem ubuntu@ec2-54-234-149-176.compute-1.amazonaws.com "
docker pull ozahnitko/scratchworks-backend-server:latest &&
docker stop scratchworks-backend-server &&
docker rm scratchworks-backend-server &&
docker run -d --name scratchworks-backend-server --network container:postgres ozahnitko/scratchworks-backend-server:latest &&
docker image prune --force"
```

### Updating the repository

```bash
ssh -i box.pem ubuntu@ec2-54-234-149-176.compute-1.amazonaws.com "
cd source/scratchworks &&
git pull"
```
