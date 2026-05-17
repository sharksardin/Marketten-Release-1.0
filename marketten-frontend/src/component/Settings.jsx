import React, { useState, useEffect } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
// ✨ 1. API 함수들을 가져옵니다.
import { getCommonConfig, updateCommonConfig } from '../api/adminApi'; // 경로는 실제 파일 위치에 맞게 수정하세요.

export default function Settings() {
  // --- 상태 관리 ---
  const [siteName, setSiteName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // --- 데이터 로딩 ---
  // ✨ 2. 페이지가 처음 열릴 때, 백엔드에서 현재 설정 값을 가져옵니다.
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const configData = await getCommonConfig();
        // 백엔드 DTO의 필드명에 맞춰서 값을 설정합니다. (예: mainTitle -> siteName)
        // 이 부분은 백엔드 CommonConfigResponseDTO의 필드명과 일치해야 합니다.
        setSiteName(configData.siteName || 'Marketten');
        setAdminEmail(configData.adminEmail || 'admin@marketten.io');
      } catch (error) {
        console.error('설정 정보 로딩 실패:', error);
        alert('설정 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []); // [] : 처음 한 번만 실행

  // --- 저장 핸들러 ---
  // ✨ 3. '저장하기' 버튼을 눌렀을 때 실행될 함수입니다.
  const handleSave = async () => {
    // 백엔드 CommonConfigRequestDTO의 필드명에 맞춰서 객체를 생성합니다.
    const configToSave = {
      siteName: siteName,
      adminEmail: adminEmail,
    };

    try {
      await updateCommonConfig(configToSave);
      alert('설정이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('설정 저장 실패:', error);
      alert('설정 저장에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="p-8">설정 정보를 불러오는 중...</div>;
  }

  return (
    <div className="p-8 bg-[#FFF9E6] min-h-screen text-[#6B3A00] space-y-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 text-[#6B3A00]">
        <Cog6ToothIcon className="h-7 w-7 text-[#A35C00]" />
        설정
      </h2>
      <p className="text-[#8B5E00]">
        사이트 정보 및 기본 환경설정을 변경할 수 있습니다.
      </p>

      <div className="space-y-6 bg-white border border-[#FFD97A] rounded-lg p-6 shadow-md max-w-lg">
        {/* 사이트 이름 */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#A35C00]">
            사이트 이름
          </label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full rounded-md border border-[#FFD97A] ..."
          />
        </div>

        {/* 관리자 이메일 */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#A35C00]">
            관리자 이메일
          </label>
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="w-full rounded-md border border-[#FFD97A] ..."
          />
        </div>

        {/* 저장 버튼 */}
        {/* ✨ 4. 저장 버튼에 onClick 이벤트를 연결합니다. */}
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#A35C00] hover:bg-[#8C4E00] text-white text-sm font-semibold rounded-md shadow-md transition"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
