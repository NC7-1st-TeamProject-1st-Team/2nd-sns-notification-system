# spring-start.sh

#!/bin/bash

REPOSITORY=/root/spring-server

echo ">작동 중인 앱의 PID 확인"

app_name="java"

app_pid=$(lsof -i :4000 -t)
echo ">app_pid"

if [ ! -z "$app_pid" ]; then
  kill -9 $app_pid

  echo "Killed the $app_name process with PID $app_pid"
  sleep 5

else
  echo "$app_name is not running"
fi

echo "> .tar.gz 파일 압축 해제"
for server_tar in *.tar.gz; do
  tar -xzvf "$server_tar"
done

echo "> gradle build 후 build/libs로 이동 작동"
cd $REPOSITORY

export PATH=$PATH:/opt/gradle/gradle-8.4/bin

gradle build

cd build/libs

echo ">경로 확인 및 목록 확인"
ls -al

pwd

echo " >nohup을 사용하여 JAR 파일 실행"
nohup java -jar app.jar > nohup.out.log 2> nohup.err.log &


----
# node-start.sh

#! /bin/bash

echo "> react  port kill && Auto build"

REPOSITORY=/root/nodejs-server

echo "> 3001 port 사용하는 애플리케이션 pid 확인"
#Auto_PID=$ ps -ef | awk '/:8080/ { print $1 }'
#Auto_PID=$(ps -ef | awk '/:8080/ { print $2 }')
Auto_PID=$(lsof -i :3001 -t)
echo "$Auto_PID"

# 만약 해당 포트를 사용하는 프로세스가 존재하면 종료
if [ ! -z "$Auto_PID" ]; then
    echo "애플리케이션을 종료합니다."

#애플리케이션을 강제로 종료하고, 종료 후 5초 동안 대기
    kill -9 $Auto_PID
    sleep 5

else
# 3001 port의 PID가 비어 있으면 실행
        echo "현재 구동 중인 애플리케이션이 없으므로 종료하지 않습니다."
fi

echo "> 압축 해제"
tar -xf *

ls -al

echo "> npm start!!!"
cd $REPOSITORY
npm run start:dev

--------------------

# react-start.sh
#! /bin/bash

echo "> react  port kill && Auto build"

REPOSITORY=/root/react-server

echo "> 3001 port 사용하는 애플리케이션 pid 확인"
#Auto_PID=$ ps -ef | awk '/:8080/ { print $1 }'
#Auto_PID=$(ps -ef | awk '/:8080/ { print $2 }')
Auto_PID=$(lsof -i :3000 -t)
echo "$Auto_PID"

# 만약 해당 포트를 사용하는 프로세스가 존재하면 종료
if [ ! -z "$Auto_PID" ]; then
    echo "애플리케이션을 종료합니다."

#애플리케이션을 강제로 종료하고, 종료 후 5초 동안 대기
    kill -9 $Auto_PID
    sleep 5

else
# 3000 port의 PID가 비어 있으면 실행
        echo "현재 구동 중인 애플리케이션이 없으므로 종료하지 않습니다."
fi

pwd

echo "> 압축 해제"
tar -xf *

ls -al

echo "> npm start!!!"
cd $REPOSITORY

npm start


