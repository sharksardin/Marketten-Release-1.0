// api/userApi.js
import axios from 'axios';
//|| 'http://localhost:8080'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// ✨ 1. axios 인스턴스 생성: API 관련 설정을 한 곳에서 관리합니다.
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/users`, // API 기본 주소
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✨ 2. 요청 인터셉터 설정: 모든 API 요청이 보내지기 전에 자동으로 실행됩니다.
apiClient.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰을 가져옵니다.
    const token = localStorage.getItem('accessToken');
    // 토큰이 있으면 Authorization 헤더에 자동으로 추가합니다.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 요청 에러가 발생했을 때의 처리
    return Promise.reject(error);
  }
);

/**
 * 1. 내 정보 조회 API
 * GET /api/users/me
 */
export const getMyInfo = async () => {
  // email을 넘길 필요 없이, 토큰을 통해 서버가 '나'를 식별합니다.
  const response = await apiClient.get('/me');
  return response.data;
};

/**
 * 2. 내 정보 수정 API (닉네임 또는 프로필 이미지)
 * PATCH /api/users/me
 * @param {object} updates - { nickname: '새닉네임', profileImage: File }
 */
export const updateMyInfo = async ({ nickname, profileImage }) => {
  const formData = new FormData();

  // 닉네임 데이터 (JSON 형식으로 추가)
  // 닉네임이 있는 경우에만 추가하도록 수정
  if (nickname) {
    formData.append(
      'request',
      new Blob([JSON.stringify({ nickname })], { type: 'application/json' })
    );
  }

  // 이미지 파일이 있을 경우에만 추가
  if (profileImage) {
    formData.append('profileImage', profileImage);
  }

  // multipart/form-data 요청을 보낼 때는 Content-Type을 명시해줘야 합니다.
  const response = await apiClient.patch('/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * 3. 비밀번호 변경 API
 * PATCH /api/users/me/password
 * @param {object} passwordData - { currentPassword: '...', newPassword: '...' }
 */
export const updateMyPassword = async (passwordData) => {
  const response = await apiClient.patch('/me/password', passwordData);
  return response.status === 200;
};

/**
 * 4. 회원 탈퇴 API
 * DELETE /api/users/me
 */
export const withdrawMe = async () => {
  const response = await apiClient.delete('/me');
  return response.status === 200;
};

/**
 * 5. 비밀번호 초기 설정 API (소셜용)
 * POST /api/users/me/init-password
 * @param {object} passwordData - { newPassword: '...' }
 */
export const initMyPassword = async (passwordData) => {
  const response = await apiClient.post('/me/init-password', passwordData);
  return response.status === 200;
};

// 온보딩 튜토리얼 완료 API
export const completeTutorial = async () => {
  // 토큰이 자동으로 포함되므로, apiClient를 사용합니다.
  const response = await apiClient.patch('/me/tutorial-complete');
  return response.status === 200;
};
