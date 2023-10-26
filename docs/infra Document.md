# infra Document
- ssh 통신으로 서버 접속
- 순서대로 입력
  -
```cp dowload/snsapp01.pem /.ssh```
```cd .ssh/config```

```
#snsapp
Host snsapp-proxy-server
        HostName 175.45.203.167
        User root
        IdentityFile ~/.ssh/snsapp.pem
```
> 핵심 통일

모든 server == > ```snsapp01.pem```으로 <br/>
PW : bitcamp!@#123tp 통일<br/>
VPC	sns-app<br/>

Subnet 사항

snsapp-public | KR-2 | public
snsapp-private-01 | KR-2 | Private


## DB
- DB 환경 변수 값 seting

### mysql 
> DB 서비스 이름 	snsapp-Mysql<br/>
DB Server 이름	spsapp-mysql-001-3ihk<br/>
Private 도메인	db-j1t71.vpc-cdb.ntruss.com<br/>
DB 접속 포트	3306<br/>

>Data Base : snsdb<br/>
user : sns-team<br/>
PW : bitcamp!@#123tp

- 접속 COMMAND
```
mysql -u sns-team -h db-j1t71.vpc-cdb.ntruss.com -p
```


### Mongo

> MONGO_URI: j2rhn.vpc.mg.naverncp.com/
MONGODB_USER: snsapp
MONGODB_PASS: bitcamp!@#123tp

MONGODB_PASS=bitcamp%21%40%23123tp(인덱스 변환)

포트: 17017



- 접속 COMMAND
```
mongo j2rhn.vpc.mg.naverncp.com:17017
```


## redis

> 접속 COMMAND<br/>
서비스 이름	sps-redis-spl<br/>
Redis 버전	REDIS 4.0.14
Hostname	sps-redis-spl-001-3isw
Role	Stand Alone
Dns     redisc-j2h4f.vpc-cdb.ntruss.com

- 접속 command
```
cd redis-6.2.6/src/   

./redis-cli -c -h redisc-j2h4f.vpc-cdb.ntruss.com -p 6379
```

## server

모든 서버 config를 통해 접근가능!
(ssh snsapp-[tab][tab]!)

> ### Private

### Spring server  
ssh snsapp-spring<br/>
ip : 172.16.2.7<br/>
Port : 4000

### Node server 
ssh snsapp-node<br/>
ip : 172.16.2.6<br/>
Port : 3001

————————————

> ### Public

<!-- React server == > 화면 렌더링
(web02-snsapp)
- 리액트로 프론트 엔드 이전하면서 로그인 세션관리 코드 좀 수정 -->


### Foroxy server 
(web01-snsapp) - 443 통신
pem : snsapp01<br/>
172.16.1.8<br/>
공인 ip : 223.130.136.59
