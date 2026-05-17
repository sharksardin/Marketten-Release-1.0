import React, { useState, useEffect } from 'react';
import Dashboard from '../component/DashBoard';
import MemberList from '../component/MemberList';
import AdminPage from '../component/AdminPage.jsx';
import FunctionSettings from '../component/Function.jsx';
import Settings from '../component/Settings';
import ManagerSidebar from '../component/ManagerSidebar';
import BasicLayout from '../layout/BasicLayout.jsx';
import MainPageSettings from '../component/MainPageSettings.jsx';
import FooterSettings from '../component/FooterSettings.jsx';

export default function ManagerPage() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [footerInfo, setFooterInfo] = useState({
    companyName: '마케튼(주)',
    address: '중부대학교',
    email: 'contact@marketten.kr',
  });

  // 컴포넌트 마운트 시 localStorage에서 데이터 불러오기
  useEffect(() => {
    const savedFooterInfo = localStorage.getItem('footerInfo');
    if (savedFooterInfo) {
      setFooterInfo(JSON.parse(savedFooterInfo));
    }
  }, []);

  const handleFooterChange = (e) => {
    const { name, value } = e.target;
    setFooterInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSaveFooter = () => {
    localStorage.setItem('footerInfo', JSON.stringify(footerInfo));
    alert('푸터 정보가 저장되었습니다.');
    setIsEditing(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'members-general':
        return <MemberList />;
      case 'members-admin':
        return <AdminPage />;
      case 'page-main':
        return <MainPageSettings />;
      case 'page-footer':
        return <FooterSettings />;
      case 'functions':
        return <FunctionSettings />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <BasicLayout>
      <div className="flex flex-1 overflow-hidden">
        <ManagerSidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-[#FFF9E6] border-l border-[#FFD97A]">
          {renderPage()}
        </main>
      </div>
    </BasicLayout>
  );
}
