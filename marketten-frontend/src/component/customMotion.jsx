import { motion } from 'framer-motion';

const defaultMotionProps = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true },
};

// 기본 속성을 가지면서, 필요시 속성을 덮어쓸 수 있는 커스텀 motion 컴포넌트를 생성하는 팩토리 함수입니다.
const createMotionComponent = (tag) => {
  const MotionComponent = motion[tag];
  return (props) => {
    // 컴포넌트에 전달된 props가 기본 props를 덮어씁니다.
    const newProps = { ...defaultMotionProps, ...props };
    return <MotionComponent {...newProps} />;
  };
};

export const MotionH1 = createMotionComponent('h1');
export const MotionH2 = createMotionComponent('h2');
export const MotionP = createMotionComponent('p');
export const MotionDiv = createMotionComponent('div');
