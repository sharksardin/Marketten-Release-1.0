import ProgressSteps from '../component/ProgressSteps';
import {
  MotionH1,
  MotionH2,
  MotionP,
  MotionDiv,
} from '../component/customMotion';
import { fadeInUp, fadeInLeft, fadeInRight } from '../component/MotionFunc';

const steps3 = [
  {
    name: '주제 설정',
    description: '글의 주제를 설정하는 단계입니다.',
    status: 'complete',
  },
  {
    name: '초안 생성',
    description: '글의 초안을 생성하는 단계입니다.',
    status: 'complete',
  },
  {
    name: '글 복사',
    description: '글을 완성하여 복사하는 단계입니다.',
    status: 'current',
  },
];

const MainPageDesc3 = () => {
  return (
    <>
      <MotionH2
        variants={fadeInUp}
        className="text-4xl font-bold mb-12 text-amber-900"
      >
        3단계
      </MotionH2>
      <div className="flex items-center shadow-2xl rounded-4xl bg-amber-200 p-8 mb-20 space-x-8">
        {/* Left Column: Progress Steps */}
        <MotionH2
          variants={fadeInLeft}
          className="text-4xl font-bold text-amber-900 flex-shrink-0"
        >
          <ProgressSteps steps={steps3} />
        </MotionH2>

        {/* Right Column: Text and Image */}
        <div className="flex flex-col items-center flex-grow space-y-8">
          {/* Image */}
          <MotionDiv variants={fadeInRight} className="w-full">
            <img
              src="https://marketten.s3.us-east-1.amazonaws.com/3%EA%B8%80%EB%B3%B5%EC%82%AC.png"
              alt="주제 생성 과정 예시"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </MotionDiv>
          {/* Text */}
          <MotionDiv variants={fadeInUp} className="left-10">
            <div className="max-w-4xl text-gray-800 text-left text-xl">
              <p className="mb-4">
                <strong>'글 복사'</strong> 단계에서는 완성된 글을 손쉽게 복사하여
                원하는 플랫폼에 바로 활용할 수 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-3 mb-6">
                <li>
                  <strong>간편한 복사:</strong> '복사' 버튼 한 번으로 작성된
                  모든 글이 클립보드에 저장되어 편리하게 사용할 수 있습니다.
                </li>
                <li>
                  <strong>다양한 활용:</strong> 복사된 글을 블로그, SNS,
                  이메일 등 어떤 온라인 플랫폼에도 자유롭게 붙여넣기하여
                  활용하세요.
                </li>
                <li>
                  <strong>형식 유지:</strong> 복사 시 글의 기본적인 형식과
                  구조가 유지되어 추가적인 편집 없이 바로 게시할 수 있습니다.
                </li>
              </ul>
              <p className="mb-4">
                이제 당신의 글을 세상에 공유할 준비가 완료되었습니다!
              </p>
              <ul className="list-disc list-inside space-y-3">
                <li>
                  <strong>즉시 게시:</strong> 복사된 글을 통해 빠르게 콘텐츠를
                  생성하고 독자들과 소통하세요.
                </li>
              </ul>
            </div>
          </MotionDiv>
        </div>
      </div>
    </>
  );
};

export default MainPageDesc3;
