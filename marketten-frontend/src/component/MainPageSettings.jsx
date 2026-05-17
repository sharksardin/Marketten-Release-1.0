import React, { useState, useEffect } from 'react';
import { getCommonConfig, updateCommonConfig } from '../api/adminApi';

export default function MainPageSettings() {
  const [mainTitle, setMainTitle] = useState('');
  const [mainSubtitle, setMainSubtitle] = useState('');
  const [ctaTitle, setCtaTitle] = useState(''); // ✨ "공식 이름"은 'ctaTitle' 입니다.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const data = await getCommonConfig();
        setMainTitle(data.mainTitle);
        setMainSubtitle(data.mainSubtitle);
        setCtaTitle(data.callToActionTitle);
        setError(null);
      } catch (err) {
        console.error('설정 정보 로딩 실패:', err);
        setError('설정 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // --- 저장 핸들러 ---
  const handleSave = async () => {
    const configToSave = {
      mainTitle: mainTitle,
      mainSubtitle: mainSubtitle,
      callToActionTitle: ctaTitle, // 키: 백엔드 DTO 필드명, 값: 프론트엔드 상태 변수
    };
    try {
      await updateCommonConfig(configToSave);
      alert('메인 페이지 정보가 성공적으로 저장되었습니다.');
    } catch (err) {
      console.error('설정 저장 실패:', err);
      alert('저장에 실패했습니다.');
    }
  };

  if (loading) return <div className="p-8">로딩 중...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 bg-[#FFF9E6] min-h-screen text-[#6B3A00] space-y-8">
      <h1 className="text-2xl font-bold mb-6 text-[#6B3A00]">
        🏠 메인 페이지 관리
      </h1>
      <div className="space-y-6 bg-white border border-[#FFD97A] rounded-lg p-6 shadow-md max-w-2xl">
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#A35C00]">
            메인 제목 (환영 메시지)
          </label>
          <input
            type="text"
            value={mainTitle}
            onChange={(e) => setMainTitle(e.target.value)}
            className="w-full rounded-md border border-[#FFD97A] bg-[#FFFDF3] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A35C00]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#A35C00]">
            부제목 (스크롤 유도)
          </label>
          <input
            type="text"
            value={mainSubtitle}
            onChange={(e) => setMainSubtitle(e.target.value)}
            className="w-full rounded-md border border-[#FFD97A] bg-[#FFFDF3] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A35C00]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#A35C00]">
            행동 유도 문구 (버튼 위)
          </label>
          <input
            type="text"
            value={ctaTitle}
            onChange={(e) => setCtaTitle(e.target.value)}
            className="w-full rounded-md border border-[#FFD97A] bg-[#FFFDF3] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A35C00]"
          />
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#A35C00] hover:bg-[#8C4E00] text-white font-semibold rounded-md shadow-md transition"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
