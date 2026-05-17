// api/tempPostApi.js
import axios from 'axios';
// || 'http://localhost:8080'
const prefixURL = `${import.meta.env.VITE_API_BASE_URL}/temp`;

// Authorization과 email 헤더 가져오기
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

// 1. 임시 저장글 생성
export const createTempPost = async (post) => {
  const response = await axios.post(`${prefixURL}/`, post, {
    headers: getHeaders(),
  });
  return response.data;
};

// 2. 임시 저장글 조회
export const getTempPost = async (inputId) => {
  const response = await axios.get(`${prefixURL}/${inputId}`, {
    headers: getHeaders(),
  });
  return response.data;
};

// 3. 임시 저장글 수정
export const updateTempPost = async (inputId, post) => {
  const response = await axios.patch(`${prefixURL}/${inputId}`, post, {
    headers: getHeaders(),
  });
  return response.data;
};

// 4. 임시 저장글 삭제
export const deleteTempPost = async (inputId) => {
  const response = await axios.delete(`${prefixURL}/${inputId}`, {
    headers: getHeaders(),
  });
  return response.data;
};

// 5. 액션 처리 - 본문 생성
export const generateContent = async (inputId, data) => {
  const response = await axios.post(
    `${prefixURL}/${inputId}/action/generateContent`,
    data,
    { headers: getHeaders() }
  );
  return response.data;
};

// 6. 액션 처리 - 키워드 분석
export const analyzeKeywords = async (inputId, data) => {
  const response = await axios.post(
    `${prefixURL}/${inputId}/action/analyzeKeywords`,
    data,
    { headers: getHeaders() }
  );
  return response.data;
};

// 7. 액션 처리 - 제목 키워드 분석
export const analyzeTitleKeywords = async (inputId, data) => {
  const response = await axios.post(
    `${prefixURL}/${inputId}/action/analyzeTitleKeywords`,
    data,
    { headers: getHeaders() }
  );
  return response.data;
};

// 8. 액션 처리 - 제목 생성
export const generateTitles = async (inputId, data) => {
  const response = await axios.post(
    `${prefixURL}/${inputId}/action/generateTitles`,
    data,
    { headers: getHeaders() }
  );
  return response.data;
};

// 9. 범용 액션 처리 함수
export const handleAction = async (inputId, action, data) => {
  const response = await axios.post(
    `${prefixURL}/${inputId}/action/${action}`,
    data,
    { headers: getHeaders() }
  );
  return response.data;
};
