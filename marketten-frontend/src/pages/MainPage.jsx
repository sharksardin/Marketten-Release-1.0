import { Link } from 'react-router-dom';
import BasicLayout from '../layout/BasicLayout';
import { motion } from 'framer-motion';
import FirstImage from '../assets/content_keyword.gif';
import SecondImage from '../assets/title_keyword.gif';
import ThirdImage from '../assets/title.gif';
import { useState, useEffect } from 'react'; // 1. useState와 useEffect를 가져옵니다.
import { getCommonConfig } from '../api/adminApi'; // 2. API 함수를 가져옵니다. (경로 확인)
import {
  MotionH1,
  MotionH2,
  MotionP,
  MotionDiv,
} from '../component/customMotion';
import { fadeInUp, fadeInLeft, fadeInRight } from '../component/MotionFunc';
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2, // 하위 요소 순차 등장 간격
    },
  },
};

export default function MainPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      setIsLogin(true);
    }

    const fetchPageData = async () => {
      try {
        const data = await getCommonConfig();
        setPageData(data);
      } catch (error) {
        console.error('메인 페이지 데이터 로딩 실패:', error);
        setPageData({
          mainTitle: '마케팅의 완성, 마케튼으로!',
          mainSubtitle:
            '간단한 클릭만으로 효과적인 제품 홍보 블로그 글을 완성하세요!',
          callToActionTitle: '지금 시작해보세요.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);

  if (loading) {
    return (
      <BasicLayout>
        <div className="h-screen flex items-center justify-center">
          페이지를 불러오는 중...
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      {/* Section 1: Welcome Message */}

      <section className="min-h-[85vh] bg-gradient-to-br from-amber-100 to-amber-300 flex flex-col items-center justify-center text-amber-900 p-8 text-center">
        <MotionH1
          variants={fadeInUp}
          custom={0} // index 0
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          className="text-5xl font-bold mb-4 font-hobbang"
        >
          {pageData.mainTitle}
        </MotionH1>

        <MotionP
          variants={fadeInUp}
          custom={1} // index 1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          className="text-2xl font-hobbang"
        >
          {pageData.mainSubtitle}
        </MotionP>

        <MotionDiv
          variants={fadeInUp}
          custom={2} // H1, P 이후 index
          initial="hidden"
          whileInView="visible"
          className="w-200 text-center p-8 rounded-2xl 
                         bg-white/30 backdrop-blur-md border border-white/70 shadow-xl 
                         hover:scale-[1.03] mt-10 transition ease-in-out transform duration-300"
        >
          <h3 className="text-2xl font-semibold text-amber-800 whitespace-pre-line">
            {
              '마케팅할 제품은 준비됐지만, 글쓰기가 막막하신가요?\n이제 마케튼이 당신의 제품 이야기를 블로그 마케팅 글로 완성해드립니다.'
            }
          </h3>
        </MotionDiv>

        <MotionDiv
          variants={fadeInUp}
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          className="text-xl mt-20"
        >
          {isLogin ? (
            <Link to="/write/1">
              <button className="bg-red-600 text-white font-bold py-3 px-8 rounded-full font-hobbang hover:bg-amber-700 transition duration-300 ease-in-out transform hover:scale-105">
                시작하기
              </button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="bg-red-600 text-white font-bold py-3 px-8 rounded-full font-hobbang hover:bg-amber-700 transition duration-300 ease-in-out transform hover:scale-105">
                로그인하고 시작하기
              </button>
            </Link>
          )}
        </MotionDiv>
      </section>

      {/* ✅ Section 2: Image Showcase Section */}
      <ImageShowcaseSection />

      {/* Section 3: Call to Action */}
      <section className="min-h-[85vh] bg-gradient-to-br from-orange-900 to-amber-400 flex flex-col items-center justify-center text-white p-8 text-center">
        <MotionH2
          variants={fadeInUp}
          className="text-4xl font-bold mb-8 font-hobbang"
        >
          {pageData.callToActionTitle}
        </MotionH2>
        <MotionP variants={fadeInUp} className="mb-8 text-lg font-hobbang">
          마케튼과 함께 마케팅을 자동화하고 비즈니스를 성장시키세요.
        </MotionP>
        <MotionDiv variants={fadeInUp}>
          {isLogin ? (
            <Link to="/write/1">
              <button className="bg-red-700 text-white font-hobbang font-bold py-3 px-8 rounded-full hover:bg-amber-600 transition duration-300 ease-in-out transform hover:scale-105">
                시작하기
              </button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="bg-red-700 text-white font-hobbang font-bold py-3 px-8 rounded-full hover:bg-amber-600 transition duration-300 ease-in-out transform hover:scale-105">
                로그인하고 시작하기
              </button>
            </Link>
          )}
        </MotionDiv>
      </section>
    </BasicLayout>
  );
}

function ImageShowcaseSection() {
  const images = [
    {
      src: FirstImage,
      title: '키워드로 시작하는 맞춤형\n마케팅 글',
      desc: '상품명과 특징을 입력하면, AI가 핵심 키워드를 자동으로\n추출하고 트렌드를 분석합니다. 사용자는 원하는 키워드를\n선택하거나 직접 추가하여 글의 방향을 정할 수 있습니다.',
    },
    {
      src: SecondImage,
      title: '본문에서 제목까지, AI가\n제안하는 키워드 인사이트',
      desc: '생성된 본문으로부터 제목 생성에 활용될 키워드를 다시 추출하고 분석합니다. 키워드를 선택하거나 직접 입력하여 제목 생성의 품질을 높일 수 있습니다.',
    },
    {
      src: ThirdImage,
      title: 'AI가 제안하는 완성도 높은 제목 생성',
      desc: '본문과 키워드를 기반으로 어울리는 제목을 AI가 제안합니다. 마음에 드는 제목을 선택하면 최종 글이 완성됩니다.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    if (index !== currentIndex) {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <section className="min-h-[85vh] bg-gradient-to-br from-amber-50 to-amber-200 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <motion.h2
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-5xl font-bold text-amber-800 text-center mt-10 font-hobbang"
      >
        생각을 키워드로, 키워드를 글로
      </motion.h2>

      <div className="relative w-full h-full max-w-7xl flex flex-col items-center justify-center">
        {/* 왼쪽 화살표 */}
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute -left-14 md:-left-20 z-10 bg-amber-200 hover:bg-amber-300 text-amber-800 p-4 rounded-full shadow-lg transition transform hover:scale-110"
          >
            ◀
          </button>
        )}

        {/* 슬라이드 컨텐츠 */}
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
          className="w-full flex flex-col md:flex-row items-center justify-center gap-12 mt-20"
        >
          {/* ✅ GIF용 이미지 비율 유지 */}
          <div className="w-full md:w-4/5 lg:w-3/4 aspect-[16/9] overflow-hidden rounded-2xl shadow-xl bg-gray-100 flex items-center justify-center border-3 border-amber-800">
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 설명 텍스트 */}
          <div className="md:w-2/3 lg:w-1/2 text-center md:text-left">
            <h3 className="text-3xl lg:text-4xl font-semibold mb-6 text-amber-700 whitespace-pre-line font-hobbang">
              {images[currentIndex].title}
            </h3>
            <p className="text-gray-800 leading-relaxed text-lg lg:text-xl whitespace-pre-line font-hobbang">
              {images[currentIndex].desc}
            </p>
          </div>
        </motion.div>

        {/* 오른쪽 화살표 */}
        {currentIndex < images.length - 1 && (
          <button
            onClick={nextSlide}
            className="absolute -right-14 md:-right-20 z-10 bg-amber-200 hover:bg-amber-300 text-amber-800 p-4 rounded-full shadow-lg transition transform hover:scale-110"
          >
            ▶
          </button>
        )}

        {/* 점 네비게이션 */}
        <div className="flex mt-8 space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 mb-10 ${
                index === currentIndex
                  ? 'bg-amber-700 scale-125'
                  : 'bg-amber-300 hover:bg-amber-400'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
