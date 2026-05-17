import React, { useState, useEffect } from 'react';
import { LOGO_URL } from '../assets/Logo_Url';
import { getCommonConfig } from '../api/adminApi';
import { Link } from 'react-router-dom';

// navigation 객체에서 social 부분만 남김
const navigation = {
  social: [
    {
      name: 'Facebook',
      href: '#', // 페이스북 링크가 있다면 여기에 넣으세요
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/mar_ketten/', // 사용자님이 주신 링크
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'X',
      href: 'https://x.com/jeonmujin60912q',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          {/* ▼▼▼ X 로고 SVG path로 변경 ▼▼▼ */}
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
          {/* ▲▲▲ X 로고 SVG path로 변경 ▲▲▲ */}
        </svg>
      ),
    },
  ],
};

const Footer = () => {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const data = await getCommonConfig();
        setFooterData(data);
      } catch (error) {
        console.error('푸터 정보 로딩 실패:', error);
        setFooterData({
          footerCompanyName: '마케튼(주)',
          footerAddress: '중부대학교',
          footerEmail: 'contact@marketten.kr',
          footerCopyright: '© 2025 Marketten Co. All rights reserved.',
        });
      }
    };
    fetchFooterData();
  }, []);

  if (!footerData) {
    return null;
  }

  return (
    <footer className="bg-white dark:bg-amber-900">
      <div className="mx-auto w-full px-1 pt-5 pb-8 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="flex flex-col items-center">
          <div className="space-y-6 text-center">
            <img alt="Company name" src={LOGO_URL} className="h-9 mx-auto" />
            <p className="text-sm/6 text-balance text-amber-600 dark:text-amber-400">
              손쉽게 마케팅 할 수 있는 플랫폼
            </p>
            <div className="text-sm text-amber-600 dark:text-amber-400">
              <p className="font-semibold">{footerData.footerCompanyName}</p>
              <p>{footerData.footerAddress}</p>
              <p>Email: {footerData.footerEmail}</p>
            </div>
            <div className="flex gap-x-6 justify-center">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon aria-hidden="true" className="size-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-amber-900/10 pt-8 sm:mt-16 lg:mt-20 dark:border-white/10 text-center">
          <p className="text-sm/6 text-amber-600 dark:text-amber-400">
            {footerData.footerCopyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
