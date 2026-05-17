# 1단계: 빌드 스테이지
FROM node:20-alpine AS build

# 작업 디렉토리 생성
WORKDIR /app

# package.json과 lock 파일만 먼저 복사 (캐시 활용)
COPY package*.json ./

# 의존성 설치 (peer dependency 무시)
RUN npm ci --no-audit --prefer-offline --legacy-peer-deps

# 나머지 소스 복사
COPY . .

# React 앱 빌드
COPY .env .env
RUN npm run build

# 2단계: Nginx로 정적 파일 서빙
FROM nginx:alpine

# 빌드된 파일을 nginx html 폴더로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# (선택) Nginx 설정 커스터마이징할 경우 nginx.conf 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 80 포트 노출
EXPOSE 80

# 컨테이너 실행 시 nginx 시작
CMD ["nginx", "-g", "daemon off;"]
