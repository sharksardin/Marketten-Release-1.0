import axios from 'axios';
//|| 'http://localhost:8080'
const prefixURL = `${import.meta.env.VITE_API_BASE_URL}/tone`;

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

// 사용자용 - 전체 톤 리스트 조회
export const fetchToneList = async () => {
  try {
    const response = await axios.get(prefixURL, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('톤 리스트 조회 실패:', error);
    throw error;
  }
};

// 관리자용 - 새로운 톤 추가
export const createTone = async (toneData) => {
  try {
    const response = await axios.post(prefixURL, toneData, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('톤 추가 실패:', error);
    throw error;
  }
};

// 관리자용 - 기존 톤 수정 (PATCH)
export const updateTone = async (toneId, toneData) => {
  try {
    const response = await axios.patch(`${prefixURL}/${toneId}`, toneData, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('톤 수정 실패:', error);
    throw error;
  }
};

// 관리자용 - 톤 삭제
export const deleteTone = async (toneId) => {
  try {
    await axios.delete(`${prefixURL}/${toneId}`, {
      headers: getHeaders(),
    });
  } catch (error) {
    console.error('톤 삭제 실패:', error);
    throw error;
  }
};
