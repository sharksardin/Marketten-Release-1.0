import ProgressSteps from '../component/ProgressSteps';
import {
  MotionH1,
  MotionH2,
  MotionP,
  MotionDiv,
} from '../component/customMotion';
import { fadeInUp, fadeInLeft, fadeInRight } from '../component/MotionFunc';

const steps2 = [
  {
    name: '주제 설정',
    description: '글의 주제를 설정하는 단계입니다.',
    status: 'complete',
  },
  {
    name: '초안 생성',
    description: '글의 초안을 생성하는 단계입니다.',
    status: 'current',
  },
  {
    name: '글 복사',
    description: '글을 완성하여 복사하는 단계입니다.',
    status: 'upcoming',
  },
];

const MainPageDesc2 = () => {
  return (
    <>
      <MotionH2
        variants={fadeInUp}
        className="text-4xl font-bold mb-12 text-amber-900"
      >
        2단계
      </MotionH2>
      <div className="flex items-center shadow-2xl rounded-4xl bg-amber-200 p-8 mb-20 space-x-8">
        {/* Left Column: Progress Steps */}
        <MotionH2
          variants={fadeInLeft}
          className="text-4xl font-bold text-amber-900 flex-shrink-0"
        >
          <ProgressSteps steps={steps2} />
        </MotionH2>

        {/* Right Column: Text and Image */}
        <div className="flex flex-col items-center flex-grow space-y-8">
          {/* Image */}
          <MotionDiv variants={fadeInRight} className="w-full">
            <img
              src="https://marketten.s3.us-east-1.amazonaws.com/2%EC%B4%88%EC%95%88%EC%83%9D%EC%84%B1.png"
              alt="주제 생성 과정 예시"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </MotionDiv>
          {/* Text */}
          <MotionDiv variants={fadeInUp} className="left-10">
            <div className="max-w-4xl text-gray-800 text-left text-xl">
              <p className="mb-4">
                <strong>'초안 생성'</strong> 단계에서는 AI가 제안하는 다양한
                초안을 확인하고, 원하는 방향으로 글을 다듬을 수 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-3 mb-6">
                <li>
                  <strong>초안 확인 및 수정:</strong> AI가 생성한 초안을
                  꼼꼼히 확인하고, 마음에 들지 않는 부분은 직접 수정하여
                  완성도를 높일 수 있습니다.
                </li>
                <li>
                  <strong>내용 추가/삭제:</strong> 초안을 바탕으로 필요한
                  내용을 추가하거나 불필요한 부분을 삭제하여 글의 흐름을
                  최적화하세요.
                </li>
                <li>
                  <strong>다양한 초안 비교:</strong> 여러 버전의 초안을
                  생성하고 비교해보며 가장 적합한 글을 선택할 수 있습니다.
                </li>
              </ul>
              <p className="mb-4">
                최종 초안을 확정하면 다음 단계로 진행할 수 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-3">
                <li>
                  <strong>키워드 연동:</strong> 이전 단계에서 선택한 키워드가
                  초안 생성에 반영되어 더욱 풍부한 글을 만듭니다.
                </li>
              </ul>
            </div>
          </MotionDiv>
        </div>
      </div>
    </>
  );
};

export default MainPageDesc2;
