// api/loginApi.js
import axios from 'axios';
//|| 'http://localhost:8080'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const prefixURL = `${API_BASE_URL}/auth`;

const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  const email = localStorage.getItem('email');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (email) {
    headers.email = email;
  }

  return headers;
};

// 1. 회원가입 + 자동 로그인
export const register = async (userRequest) => {
  const response = await axios.post(`${prefixURL}/register`, userRequest);
  return response.data; // 반드시 data만 반환
};

//이메일 중복 확인
export const checkEmail = async (email) => {
  const response = await axios.get(`${prefixURL}/check-email`, {
    params: { email },
  });
  return response.data; // true: 사용 가능, false: 중복
};

//닉네임 중복 확인
export const checkNickname = async (nickname) => {
  const response = await axios.get(`${prefixURL}/check-nickname`, {
    params: { nickname },
  });
  return response.data; // true: 사용 가능, false: 중복
};

// 2. 로그인
export const login = async (loginRequest) => {
  try {
    const loginUrl = `${prefixURL}/login`;
    console.log('🔐 Login API URL:', loginUrl);
    console.log('🔐 Login Request:', loginRequest);

    const response = await axios.post(loginUrl, loginRequest, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Login Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Login API Error:', error);
    console.error('❌ Error Response:', error.response);
    throw error;
  }
};
// 3. 토큰 재발급
export const refreshToken = async (refreshRequest) => {
  const response = await axios.post(`${prefixURL}/refresh`, refreshRequest, {
    headers: getHeaders(),
  });
  return response.data; // TokenInfo 반환
};

// 4. 로그아웃
export const logout = async (logoutRequest) => {
  const response = await axios.post(`${prefixURL}/logout`, logoutRequest, {
    headers: getHeaders(),
  });
  return response.status === 200;
};

// 5. 이메일 기반 비밀번호 재설정
export const resetPassword = async ({ email, newPassword }) => {
  const response = await axios.patch(
    `${prefixURL}/password-reset`,
    { email, newPassword },
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return response.status === 200;
};
