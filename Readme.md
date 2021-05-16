### 로컬 환경 세팅

`git clone` 으로 해당 저장소를 로컬에 다운받는다.
```
git clone git@github.com:Ywoosang/Code-Fridge.git
```

`service-application/api` 디렉토리에서 다음 명령어를 입력해 패키지를 설치한다.  
```
npm i
```

다음 경로에 위치한 `.env.example` 파일을 `.env` 로 이름을 변경한다.  

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

compose down 명령어로 컨테이너와 네트워크를 삭제한다.
```bash
docker compose down 
```

실행시키면서 빌드를 진행하고 싶다면 다음 명령어를 입력한다.
```bash
docker-compose up --build
```
캐시처리된 이미지로 인해 docker-compose 내용이 바뀌지 않거나 특정 변화가 없다고 판단되면 다음 명령어를 입력해 강제적으로 이미지를 생성한다.
```bash
docker-compose up -d --force-recreate
```

### 알림 
시크릿 키 값이 필요할 경우 [ywoosang](mailto:opellong13@gmail.com) 에게 요청한다.  
건의사항은 `issue` 로 등록한다.  

### 도커 환경 구축 
mysql 컨테이너를 삭제해도 데이터가 보존된다  
로컬 코드 변경 시 컨테이너에 실시간으로 반영된다    
`docker-compose` 를 이용해 `application`,`redis`,`mysql` 컨테이너들을 하나의 네트워크를 통해 연결한다  









