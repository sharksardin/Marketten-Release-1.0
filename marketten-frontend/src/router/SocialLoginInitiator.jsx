import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SocialLoginInitiator = () => {
  const { provider } = useParams(); // 'google', 'kakao', 'naver'

  useEffect(() => {
    console.log(
      `SocialLoginInitiator: ${provider} 제공자에 대한 리디렉션을 시도 중입니다.`
    ); // <--- 이것을 추가합니다.
    if (provider) {
      // 백엔드 OAuth2 시작 URL 구성
      // VITE_API_BASE_URL이 이미 사용 가능하지 않다면 여기서 가져와야 할 수 있습니다.
      const backendOAuthUrl = `https://www.marketten.shop/oauth2/authorization/${provider}`;
      console.log(
        `SocialLoginInitiator: 백엔드 OAuth URL로 리디렉션 중: ${backendOAuthUrl}`
      ); // <--- 이것을 추가합니다.
      window.location.href = backendOAuthUrl; // 전체 페이지 리디렉션 수행
    }
  }, [provider]);

  return (
    <div>
      <p>{provider} 로그인으로 리디렉션 중...</p>
      {/* 여기에 스피너 또는 로딩 메시지를 추가할 수 있습니다. */}
    </div>
  );
};

export default SocialLoginInitiator;
