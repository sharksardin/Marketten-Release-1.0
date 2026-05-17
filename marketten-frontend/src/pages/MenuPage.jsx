'use client';

import React from 'react';
import BasicLayout from '../layout/BasicLayout';
import MainPageDesc1 from '../component/MainPageDesc1';
import MainPageDesc2 from '../component/MainPageDesc2';
import MainPageDesc3 from '../component/MainPageDesc3';
import { fadeInUp } from '../component/MotionFunc';
import { MotionDiv } from '../component/customMotion';
import { Link } from 'react-router-dom';

const MenuPage = () => {
  return (
    <BasicLayout>
      <section className="min-h-screen bg-gradient-to-br from-yellow-100 to-amber-100 flex flex-col items-center justify-center p-8 pt-20 font-hobbang">
        {/* Step1 Descriptions */}
        <MainPageDesc1 />
        {/* Step2 Descriptions */}
        <MainPageDesc2 />
        {/* Step3 Descriptions */}
        <MainPageDesc3 />

        <MotionDiv variants={fadeInUp}>
          <Link to="/login">
            <button className="bg-red-700 text-white font-bold py-3 px-8 rounded-full hover:bg-amber-600 transition duration-300 ease-in-out transform hover:scale-105 font-hobbang">
              로그인하고 시작하기
            </button>
          </Link>
        </MotionDiv>
      </section>
    </BasicLayout>
  );
};

export default MenuPage;
