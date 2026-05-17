import React, { useState, useEffect } from 'react';
import { getCommonConfig, updateCommonConfig } from '../api/adminApi';

export default function FooterSettings() {
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [copyright, setCopyright] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const data = await getCommonConfig();
        setCompanyName(data.footerCompanyName);
        setAddress(data.footerAddress);
        setEmail(data.footerEmail);
        setCopyright(data.footerCopyright);
      } catch (error) {
        alert('푸터 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    const configToSave = {
      footerCompanyName: companyName,
      footerAddress: address,
      footerEmail: email,
      footerCopyright: copyright,
    };
    try {
      await updateCommonConfig(configToSave);
      alert('푸터 정보가 성공적으로 저장되었습니다.');
    } catch (error) {
      alert('저장에 실패했습니다.');
    }
  };

  if (loading) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="p-8 bg-[#FFF9E6] min-h-screen text-[#6B3A00] space-y-8">
      <h1 className="text-2xl font-bold mb-6 text-[#6B3A00]">⚙️ 푸터 설정</h1>
      <div className="space-y-6 bg-white border border-[#FFD97A] rounded-lg p-6 shadow-md max-w-2xl">
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#A35C00]">
            회사명
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-md border border-[#FFD97A] bg-[#FFFDF3] px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#A35C00]">
            주소
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-md border border-[#FFD97A] bg-[#FFFDF3] px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#A35C00]">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-[#FFD97A] bg-[#FFFDF3] px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#A35C00]">
            저작권 문구
          </label>
          <input
            type="text"
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            className="w-full rounded-md border border-[#FFD97A] bg-[#FFFDF3] px-3 py-2"
          />
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#A35C00] hover:bg-[#8C4E00] text-white font-semibold rounded-md"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
