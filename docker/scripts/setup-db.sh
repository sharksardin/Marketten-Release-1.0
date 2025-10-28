#!/bin/bash
# docker/scripts/setup-db.sh

set -e  # 오류 발생시 스크립트 중단

echo "🗄️ GPT Demo 데이터베이스 설정 시작..."

# Docker Compose 파일 경로: 현재 실행 위치가 docker/scripts/ 의 경우 
COMPOSE_FILE="../docker-compose.prod.yml"
PROJECT_NAME="gpt-demo"

# MySQL 컨테이너가 준비될 때까지 대기
echo "📡 MySQL 컨테이너 준비 중..."
docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME up -d mysql

# MySQL 헬스체크 대기
echo "⏱️ MySQL 시작 대기 중..."
timeout=300  # 5분 타임아웃
counter=0

while [ $counter -lt $timeout ]; do
    if docker exec gpt_mysql mysql -u root -prootpassword -e "SELECT 1;" > /dev/null 2>&1; then
        echo "✅ MySQL이 준비되었습니다!"
        break
    fi
    
    echo "⏳ MySQL 대기 중... ($counter/$timeout 초)"
    sleep 5
    counter=$((counter + 5))
done

if [ $counter -ge $timeout ]; then
    echo "❌ MySQL 시작 타임아웃!"
    exit 1
fi

# 데이터베이스 및 사용자 생성 확인
echo "🔧 데이터베이스 설정 확인 중..."
docker exec gpt_mysql mysql -u root -prootpassword -e "
    CREATE DATABASE IF NOT EXISTS gpt_demo;
    CREATE USER IF NOT EXISTS 'gpt_user'@'%' IDENTIFIED BY 'gpt_password';
    GRANT ALL PRIVILEGES ON gpt_demo.* TO 'gpt_user'@'%';
    FLUSH PRIVILEGES;
    
    -- 설정 확인
    USE gpt_demo;
    SELECT 'Database created successfully' as status;
    SHOW GRANTS FOR 'gpt_user'@'%';
"

# 테이블 생성 확인 (init.sql이 실행되었는지 확인)
echo "📊 테이블 생성 확인 중..."
docker exec gpt_mysql mysql -u gpt_user -pgpt_password -D gpt_demo -e "
    SHOW TABLES;
    DESCRIBE users;
"

echo "✨ 데이터베이스 설정 완료!"