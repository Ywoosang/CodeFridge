 
.env 파일을 해당 경로에 생성한다. 
```
dropbox/
├─ service-application/
├─ radis-database/
├─ mysql-database/
├─ .env
└─ docker-compose.yml
```
compose up 명령어로 네트워크로 연결된 컨테이너 프로세스를 띄운다. 
```bash
docker compose up
```
실행시키면서 빌드를 진행할 때는 다음 명령어를 입력한다.
```bash
docker-compose up --build
```
캐시처리된 이미지로 인해 docker-compose 내용이 바뀌지 않거나 특정 변화가 없다고 판단되면 다음 명령어를 입력해 강제적으로 이미지를 생성한다.
```bash
docker-compose up -d --force-recreate
```
compose down 명령어로 컨테이너와 네트워크를 삭제한다.
이때 volume 을 이용해 컨테이너가 내려가도 도커가 관리하는 로컬 영역에 작업 코드가 남아있을 수 있도록 구성했다. 
```bash
docker compose down 
```