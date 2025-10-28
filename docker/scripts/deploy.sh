#!/bin/bash
set -e

echo "🚀 GPT Demo 배포 시작..."

# 환경 변수 확인
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY 환경변수가 설정되지 않았습니다."
    exit 1
fi

# 기존 컨테이너 정리
echo "🧹 기존 컨테이너 정리 중..."
docker-compose -f ../docker-compose.prod.yml down -v

# 이미지 빌드
echo "🔨 이미지 빌드 중..."
docker-compose -f ../docker-compose.prod.yml build --no-cache

# 1단계: MySQL 먼저 시작
echo "📡 MySQL 서비스 시작 중..."
docker-compose -f ../docker-compose.prod.yml up -d mysql

# 2단계: DB 준비 대기
echo "⏱️ 데이터베이스 준비 중..."
./setup-db.sh

# 3단계: 나머지 서비스 시작
echo "🎯 전체 서비스 시작 중..."
docker-compose -f ../docker-compose.prod.yml up -d

# 4단계: 헬스체크
echo "🏥 서비스 상태 확인 중..."
sleep 30

# 서비스별 헬스체크
echo "Frontend: http://$(curl -s ifconfig.me)"
echo "Backend API: http://$(curl -s ifconfig.me):8080/actuator/health"  
echo "AI Module: http://$(curl -s ifconfig.me):8000/health"

echo "✅ 배포 완료!"
