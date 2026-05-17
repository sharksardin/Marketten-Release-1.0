import { useState, useEffect } from 'react';
import spinner from '../assets/loadingrobot.png';

const LoadingPage = ({ message = '로딩 중입니다', transparent = false }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 bg-black/30 ${
        transparent ? '' : 'h-screen'
      }`}
    >
      <img src={spinner} alt="로딩 중" className="w-16 h-16" />
      <h4 className="text-white text-2xl mt-4">
        {message}
        {dots}
      </h4>
    </div>
  );
};

export default LoadingPage;
