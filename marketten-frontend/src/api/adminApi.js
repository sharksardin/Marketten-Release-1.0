// api/adminApi.js
import axios from 'axios';
// || 'http://localhost:8080'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1. 관리자 API 전용 axios 인스턴스 생성
const adminApiClient = axios.create({
  baseURL: `${API_BASE_URL}/admin`, // 관리자 API 기본 주소
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청 인터셉터 설정: 모든 관리자 API 요청에 자동으로 토큰을 포함시킵니다.
adminApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- API 함수들 (이제 adminApiClient를 사용) ---

// 1. 사용자 리스트 조회 (페이징)
export const getUserList = async (page, size, role) => {
  const response = await adminApiClient.get(`/users/${page}/${size}`, {
    params: { role },
  });
  return response.data;
};

// 2. 사용자 상세 정보 조회
export const getUserDetail = async (userid) => {
  const response = await adminApiClient.get(`/users/${userid}`);
  return response.data;
};

// 3. 대시보드 전체 통계 조회
export const getDashboardStats = async () => {
  const response = await adminApiClient.get(''); // baseURL이 /api/admin이므로 경로 없이 호출
  return response.data;
};

// 4. 리포트 요약 통계 API 호출 함수
export const getReportSummary = async () => {
  const response = await adminApiClient.get('/visitors');
  return response.data;
};

// 5. 사용자 권한 수정
export const updateUserRole = async (userid, newRole) => {
  const response = await adminApiClient.patch(`/role/${userid}`, { newRole });
  return response.data;
};

// 6. GPT 모델 업데이트
export const updateGPTModel = async (modelName) => {
  const response = await adminApiClient.patch('/model', { modelName });
  return response.data;
};

// 7. 관리자 비밀번호 변경
export const updateAdminPassword = async (
  adminid,
  currentPassword,
  newPassword
) => {
  const response = await adminApiClient.patch(`/${adminid}`, {
    currentPassword,
    newPassword,
  });
  return response.data;
};

// 사이트 공통 설정 조회 API
export const getCommonConfig = async () => {
  // 관리자 전용 클라이언트가 아닌, 일반 axios를 사용하여 공개 API를 호출합니다.
  const response = await axios.get(`${API_BASE_URL}/common/config`);
  return response.data;
};

// 사이트 공통 설정 수정 API (adminApiClient 사용)
export const updateCommonConfig = async (configData) => {
  const response = await adminApiClient.patch('/common', configData);
  return response.data;
};
