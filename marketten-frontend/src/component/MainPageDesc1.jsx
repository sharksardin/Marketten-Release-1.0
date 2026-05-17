import ProgressSteps from '../component/ProgressSteps';
import {
  MotionH1,
  MotionH2,
  MotionP,
  MotionDiv,
} from '../component/customMotion';
import { fadeInUp, fadeInLeft, fadeInRight } from '../component/MotionFunc';

const steps1 = [
  {
    name: '주제 설정',
    description: '글의 주제를 설정하는 단계입니다.',
    status: 'current',
  },
  {
    name: '초안 생성',
    description: '글의 초안을 생성하는 단계입니다.',
    status: 'upcoming',
  },
  {
    name: '글 복사',
    description: '글을 완성하여 복사하는 단계입니다.',
    status: 'upcoming',
  },
];

const MainPageDesc1 = () => {
  return (
    <>
      <MotionH2
        variants={fadeInUp}
        className="text-4xl font-bold mb-12 text-amber-900"
      >
        1단계
      </MotionH2>
      <div className="flex items-center shadow-2xl rounded-4xl bg-amber-200 p-8 mb-20 space-x-8">
        {/* Left Column: Progress Steps */}
        <MotionH2
          variants={fadeInLeft}
          className="text-4xl font-bold text-amber-900 flex-shrink-0"
        >
          <ProgressSteps steps={steps1} />
        </MotionH2>

        {/* Right Column: Text and Image */}
        <div className="flex flex-col items-center flex-grow space-y-8">
          {/* Image */}
          <MotionDiv variants={fadeInRight} className="w-full">
            <img
              src="https://marketten.s3.us-east-1.amazonaws.com/1%EC%A3%BC%EC%A0%9C%EC%83%9D%EC%84%B1.png"
              alt="주제 생성 과정 예시"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </MotionDiv>
          {/* Text */}
          <MotionDiv variants={fadeInUp} className="left-10">
            <div className="max-w-4xl text-gray-800 text-left text-xl">
              <p className="mb-4">
                <strong>'주제 설정'</strong> 단계에서는 다음 정보를 입력하여 AI
                글쓰기를 시작할 수 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-3 mb-6">
                <li>
                  <strong>상품 정보 및 특징:</strong> 독자에게 소개하고 싶은
                  상품의 핵심 정보와 장점을 알려주세요.
                </li>
                <li>
                  <strong>사용 후기:</strong> 상품을 직접 사용해본 경험을
                  바탕으로 생생한 후기를 작성해주세요.
                </li>
                <li>
                  <strong>글의 톤앤매너:</strong> 독자가 어떤 느낌을 받았으면
                  좋겠나요? 글의 전체적인 분위기를 선택해주세요.
                </li>
              </ul>
              <p className="mb-4">
                입력된 정보를 바탕으로 AI가 최적의 키워드를 추천해 드립니다.
              </p>
              <ul className="list-disc list-inside space-y-3">
                <li>
                  <strong>키워드 선택 및 관리:</strong> AI가 제안한 키워드를
                  자유롭게 선택, 추가, 삭제하며 원하는 방향으로 글을 완성할 수
                  있습니다.
                </li>
              </ul>
            </div>
          </MotionDiv>
        </div>
      </div>
    </>
  );
};

export default MainPageDesc1;
