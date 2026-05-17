// api/postApi.js
import axios from 'axios';
//|| 'http://localhost:8080'
const prefixURL = `${import.meta.env.VITE_API_BASE_URL}/posts`;

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

// 1. 최종글 조회
export const getPost = async (postId) => {
  const response = await axios.get(`${prefixURL}/${postId}`, {
    headers: getHeaders(),
  });
  return response.data;
};

// 2. 최종글 수정
export const updatePost = async (postId, post) => {
  const response = await axios.patch(`${prefixURL}/${postId}`, post, {
    headers: getHeaders(),
  });
  return response.data;
};

// 3. 최종글 삭제
export const deletePost = async (postId) => {
  const response = await axios.delete(`${prefixURL}/${postId}`, {
    headers: getHeaders(),
  });
  return response.data;
};

// 4. 이메일 기반 최종글 리스트 조회
export const getPostsByEmail = async () => {
  const email = localStorage.getItem('email');
  const response = await axios.get(`${prefixURL}/user?email=${email}`, {
    headers: getHeaders(),
  });
  return response.data;
};
