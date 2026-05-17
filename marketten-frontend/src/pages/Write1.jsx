import BasicLayout from '../layout/BasicLayout';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Joyride, { STATUS } from 'react-joyride';
import { XMarkIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import {
  createTempPost,
  updateTempPost,
  analyzeKeywords,
  generateContent,
  getTempPost,
} from '../api/tempPostApi';
import { updatePost } from '../api/postApi';
import { fetchToneList } from '../api/tonelistApi';
import { completeTutorial } from '../api/userApi';
import KeywordAnal from '../component/KeywordAnal';
import LoadingPage from '../pages/LoadingPage';

const handleJoyrideCallback = async (data) => {
  const { status } = data;
  if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
    setRunTour(false);
    try {
      // 튜토리얼이 끝나면, 백엔드에 완료 상태를 알립니다.
      await completeTutorial();
      console.log('튜토리얼 완료 상태가 서버에 저장되었습니다.');
    } catch (error) {
      console.error('튜토리얼 완료 상태 저장 실패:', error);
    }
  }
};

const steps = [
  {
    name: '주제 설정',
    description: '글의 주제를 설정하는 단계입니다.',
    href: '/write/1',
    status: 'current',
  },
  {
    name: '초안 생성',
    description: '글의 초안을 생성하는 단계입니다.',
    href: '/write/2',
    status: 'upcoming',
  },
  {
    name: '글 복사',
    description: '글을 완성하여 복사하는 단계입니다.',
    href: '/write/3',
    status: 'upcoming',
  },
];

const Write1 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- 상태 관리 ---
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [inputId, setInputId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productInfo, setProductInfo] = useState('');
  const [productFeatures, setProductFeatures] = useState('');
  const [userExperience, setUserExperience] = useState('');
  const [keywordError, setKeywordError] = useState('');
  const [postError, setPostError] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [toneList, setToneList] = useState([]);
  const [selectedTonePreviewIndex, setSelectedTonePreviewIndex] =
    useState(null);
  //키워드
  const [keywordList, setKeywordList] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [runTour, setRunTour] = useState(false);
  //미리보기 모달
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    tone: null,
  });
  //로딩
  const [loadingMessage, setLoadingMessage] = useState('');

  // --- 온보딩 튜토리얼 ---
  const tourSteps = [
    {
      target: '#product-info-input',
      content: '가장 먼저, 홍보하고 싶은 상품의 이름을 입력해주세요!',
      placement: 'bottom',
    },
    {
      target: '#product-features-input',
      content: '다음으로, 상품의 핵심적인 특징들을 간략하게 설명해주세요.',
      placement: 'bottom',
    },
    {
      target: '#user-experience-input',
      content:
        '실제 사용 경험이나 강조하고 싶은 후기를 자유롭게 작성해주세요. 이 부분이 글의 진정성을 높여줍니다!',
      placement: 'bottom',
    },
    {
      target: '#keyword-analysis-button',
      content:
        '입력이 끝나면, 이 버튼을 눌러 AI가 추천하는 마케팅 키워드를 받아보세요.',
      placement: 'top',
    },
    {
      target: '#generate-post-button',
      content:
        '마지막으로 키워드를 선택하고 이 버튼을 누르면, AI가 모든 내용을 조합하여 멋진 블로그 글의 초안을 생성해줍니다!',
      placement: 'top',
    },
  ];

  useEffect(() => {
    const loadTones = async () => {
      try {
        const data = await fetchToneList();
        setToneList(data);
        if (data.length > 0) {
          setSelectedTone(data[0].toneName);
        }
      } catch (err) {
        console.error('톤 리스트 불러오기 실패:', err);
      }
    };
    loadTones();

    // ✨ location.state에서 tempPostId 가져오기 (URL에 노출되지 않음)
    const loadTempPostData = async () => {
      const tempPostId = location.state?.tempPostId;

      if (tempPostId) {
        try {
          setLoading(true);
          setLoadingMessage('저장된 데이터를 불러오는 중입니다');

          const tempPostData = await getTempPost(tempPostId);

          setInputId(tempPostData.inputId);
          setProductInfo(tempPostData.productInfo || '');
          setProductFeatures(tempPostData.productFeatures || '');
          setUserExperience(tempPostData.userExperience || '');
          setSelectedTone(
            tempPostData.selectedTone || toneList[0]?.toneName || ''
          );

          if (tempPostData.keywordList && tempPostData.keywordList.length > 0) {
            setKeywordList(tempPostData.keywordList);
            setKeywords(tempPostData.keywordList.map((k) => k.keywordName));
          } else if (tempPostData.keywords) {
            const keywordsArray = tempPostData.keywords
              .split(', ')
              .filter((k) => k.trim());
            setKeywords(keywordsArray);
          }
        } catch (err) {
          console.error('임시 저장 데이터 불러오기 실패:', err);
          alert('저장된 데이터를 불러오는데 실패했습니다.');
        } finally {
          setLoading(false);
          setLoadingMessage('');
        }
      }
    };

    loadTempPostData();

    // 튜토리얼 처리
    const params = new URLSearchParams(location.search);
    const needsTourFromUrl = params.get('tour') === 'true';
    const hasCompletedTour =
      localStorage.getItem('hasCompletedTour') === 'true';

    if (needsTourFromUrl && !hasCompletedTour) {
      setTimeout(() => setRunTour(true), 500);
    }
  }, [location]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      localStorage.setItem('hasCompletedTour', 'true');
    }
  };

  // --- 핸들러 함수들 ---
  const handleAddKeyword = () => {
    if (inputValue.trim() && !keywords.includes(inputValue.trim())) {
      setKeywords([...keywords, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((kw) => kw !== keywordToRemove));
  };

  const handleAnalyzeKeywords = async () => {
    setPostError('');
    setKeywordError('');
    if (!productInfo.trim()) {
      setKeywordError('상품 정보를 입력해주세요.');
      return;
    }
    if (!productFeatures.trim()) {
      setKeywordError('상품 특징을 입력해주세요.');
      return;
    }
    if (!userExperience.trim()) {
      setKeywordError('사용자 경험을 입력해주세요.');
      return;
    }
    setLoadingMessage('AI로 키워드 분석 중입니다');
    setLoading(true);
    try {
      let id = inputId;
      if (!id) {
        const tempPost = await createTempPost({});
        id = tempPost.inputId;
        setInputId(id);
      }
      await updateTempPost(id, {
        productInfo,
        productFeatures,
        userExperience,
        selectedTone,
        keywords: keywords.join(', '),
        keywordList: keywords.map((kw) => ({ keywordName: kw })),
        step: 1,
      });
      const analyzed = await analyzeKeywords(id, {
        productInfo,
        productFeatures,
        userExperience,
      });
      if (analyzed.keywordList) {
        setKeywordList(analyzed.keywordList);
        setKeywords(analyzed.keywordList.map((k) => k.keywordName));
      }
    } catch (err) {
      console.error(err);
      setKeywordError('키워드 분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
      setOpen(true);
    }
  };

  const handleTempSave = async () => {
    setLoadingMessage('저장 중입니다');
    setLoading(true);
    try {
      let id = inputId;
      if (!id) {
        const tempPost = await createTempPost({});
        id = tempPost.inputId;
        setInputId(id);
      }
      const updateData = {
        productInfo,
        productFeatures,
        userExperience,
        selectedTone,
        keywords: keywords.join(', '),
        keywordList: keywordList.map((kw) => ({
          keywordId: kw.keywordId ?? null,
          tempPostId: id,
          keywordName: kw.keywordName,
          averageSearchValue: kw.averageSearchValue ?? 0,
          peakSearchValue: kw.peakSearchValue ?? 0,
        })),
        step: 1,
      };
      await updateTempPost(id, updateData);
    } catch (err) {
      console.error('저장 에러:', err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleGeneratePost = async () => {
    setPostError('');
    setKeywordError('');
    if (!productInfo.trim()) {
      setPostError('상품 정보를 입력해주세요.');
      return;
    }
    if (!productFeatures.trim()) {
      setPostError('상품 특징을 입력해주세요.');
      return;
    }
    if (!userExperience.trim()) {
      setPostError('사용자 경험을 입력해주세요.');
      return;
    }
    if (keywords.length === 0) {
      setPostError('키워드를 최소 1개 이상 선택해주세요.');
      return;
    }
    setLoadingMessage('AI로 글 생성 중입니다');
    setLoading(true);
    try {
      let id = inputId;
      if (!id) {
        const tempPost = await createTempPost({});
        id = tempPost.inputId;
        setInputId(id);
      }
      await updateTempPost(id, {
        productInfo,
        productFeatures,
        userExperience,
        selectedTone,
        keywords: keywords.join(', '),
        keywordList: keywordList.map((kw) => ({
          keywordName: kw.keywordName,
          averageSearchValue: kw.averageSearchValue,
          peakSearchValue: kw.peakSearchValue,
        })),
        step: 2,
      });
      // 선택된 톤의 tonePreview 찾기
      const selectedToneData = toneList.find(
        (tone) => tone.toneName === selectedTone
      );

      const finalData = {
        productInfo,
        productFeatures,
        userExperience,
        selectedTone: selectedTone || 'STANDARD',
        tonePreview: selectedToneData?.tonePreview || '', //tonePreview 추가
        keywords: keywords.join(', '),
      };
      const generated = await generateContent(id, finalData);
      if (generated.postId) {
        await updatePost(generated.postId, {
          finalContent: generated.generatedContent,
          status: 'Content',
          finalTone: selectedTone || 'STANDARD',
        });
      }
      navigate('/write/2', { state: { tempPostId: id } });
    } catch (err) {
      console.error(err);
      setPostError('글 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <BasicLayout>
      <>
        {/* 로딩 오버레이 - 최상위에 배치 */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
            <LoadingPage message={loadingMessage} transparent />
          </div>
        )}

        <Joyride
          steps={tourSteps}
          run={runTour}
          callback={handleJoyrideCallback}
          continuous
          showProgress
          showSkipButton
          locale={{
            back: '이전',
            close: '닫기',
            last: '완료',
            next: '다음',
            skip: '건너뛰기',
          }}
          styles={{
            options: {
              primaryColor: '#dc2626',
              textColor: '#374151',
              arrowColor: '#ffffff',
              backgroundColor: '#ffffff',
            },
            tooltip: {
              borderRadius: '0.5rem',
              padding: '1rem',
              width: '350px',
            },
            tooltipContainer: {
              textAlign: 'left',
            },
          }}
        />

        {previewModal.isOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div
              className="bg-white w-full max-w-lg mx-4 max-h-[80vh] flex flex-col 
                rounded-2xl shadow-lg"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {previewModal.tone?.toneName} 미리보기
                </h3>
                <button
                  onClick={() =>
                    setPreviewModal({
                      isOpen: false,
                      tone: null,
                    })
                  }
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="px-6 py-4 overflow-y-auto flex-1">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {previewModal.tone?.tonePreview ||
                    '미리보기 문장이 없습니다.'}
                </p>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() =>
                    setPreviewModal({
                      isOpen: false,
                      tone: null,
                    })
                  }
                  className="rounded-md px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
        <KeywordAnal
          open={open}
          setOpen={setOpen}
          keywordList={keywordList}
          setKeywords={setKeywords}
        />

        <section
          aria-labelledby="payment-heading"
          className="relative h-full flex flex-col items-center bg-indigo-950 p-4 pt-10"
        >
          <nav
            aria-label="Progress"
            className="hidden xl:flex w-full max-w-3xl mb-6"
          >
            <ol role="list" className="flex w-full space-x-8">
              {steps.map((step) => (
                <li key={step.name} className="flex-1">
                  {step.status === 'current' ? (
                    <Link
                      to={step.href}
                      className="flex flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pt-4 md:pl-0"
                      aria-current="step"
                    >
                      <span className="text-sm font-medium text-indigo-600">
                        {step.name}
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        {step.description}
                      </span>
                    </Link>
                  ) : (
                    <Link
                      to={step.href}
                      className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pt-4 md:pl-0"
                    >
                      <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                        {step.name}
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        {step.description}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="relative w-full max-w-5xl px-6 py-8 bg-white/10 rounded-2xl mx-4 lg:mx-0">
            <div className="bg-indigo-950 p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-12 gap-x-4 gap-y-6">
                  {/* ✨ 상품 입력 필드 (툴팁 + 탭 이동 문제 해결) */}
                  <div className="col-span-full">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="product-info-input"
                        className="block text-sm/6 font-medium text-gray-400"
                      >
                        상품 입력
                      </label>
                      <Popover className="relative">
                        <PopoverButton
                          tabIndex={-1}
                          className="flex items-center text-gray-400 hover:text-indigo-400 focus:outline-none"
                        >
                          <QuestionMarkCircleIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </PopoverButton>
                        <PopoverPanel
                          transition
                          className="absolute z-10 w-screen max-w-sm -translate-x-1/2 left-1/2 mt-3 transform px-4 sm:px-0 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                            <div className="relative bg-white p-4">
                              <p className="text-sm font-medium text-gray-900">
                                💡 예시: 로지텍 G PRO X SUPERLIGHT
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                홍보하고자 하는 상품의 정확한 명칭을
                                입력해주세요.
                              </p>
                            </div>
                          </div>
                        </PopoverPanel>
                      </Popover>
                    </div>
                    <textarea
                      id="product-info-input"
                      value={productInfo}
                      onChange={(e) => setProductInfo(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                  </div>

                  {/* ✨ 상품 특징 입력 필드 (툴팁 + 탭 이동 문제 해결) */}
                  <div className="col-span-full">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="product-features-input"
                        className="block text-sm/6 font-medium text-gray-400"
                      >
                        상품 특징 입력
                      </label>
                      <Popover className="relative">
                        <PopoverButton
                          tabIndex={-1}
                          className="flex items-center text-gray-400 hover:text-indigo-400 focus:outline-none"
                        >
                          <QuestionMarkCircleIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </PopoverButton>
                        <PopoverPanel
                          transition
                          className="absolute z-10 w-screen max-w-sm -translate-x-1/2 left-1/2 mt-3 transform px-4 sm:px-0 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                            <div className="relative bg-white p-4">
                              <p className="text-sm font-medium text-gray-900">
                                💡 예시: 초경량 무게, HERO 25K 센서, 무선 연결
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                상품의 핵심적인 기능, 기술, 디자인 등 특징을
                                상세하게 설명해주세요.
                              </p>
                            </div>
                          </div>
                        </PopoverPanel>
                      </Popover>
                    </div>
                    <textarea
                      id="product-features-input"
                      value={productFeatures}
                      onChange={(e) => setProductFeatures(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                  </div>

                  {/* ✨ 사용자 경험 입력 필드 (툴팁 + 탭 이동 문제 해결) */}
                  <div className="col-span-full">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="user-experience-input"
                        className="block text-sm/6 font-medium text-gray-400"
                      >
                        사용자 경험 입력
                      </label>
                      <Popover className="relative">
                        <PopoverButton
                          tabIndex={-1}
                          className="flex items-center text-gray-400 hover:text-indigo-400 focus:outline-none"
                        >
                          <QuestionMarkCircleIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </PopoverButton>
                        <PopoverPanel
                          transition
                          className="absolute z-10 w-screen max-w-sm -translate-x-1/2 left-1/2 mt-3 transform px-4 sm:px-0 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                            <div className="relative bg-white p-4">
                              <p className="text-sm font-medium text-gray-900">
                                💡 예시: 그립감이 좋고, 사용감이 편했다. 매크로
                                기능이 추가 되었고, 유선과 무선의 성능 차이가
                                거의 없어 좋았다.
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                실제 사용 후기, 특별히 강조하고 싶은 장점,
                                구매자들이 얻을 수 있는 가치 등을 구체적으로
                                작성해주세요.
                              </p>
                            </div>
                          </div>
                        </PopoverPanel>
                      </Popover>
                    </div>
                    <textarea
                      id="user-experience-input"
                      value={userExperience}
                      onChange={(e) => setUserExperience(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                  </div>

                  {/* 톤 선택 필드 */}
                  <div className="col-span-full max-w-6xl">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      글의 톤 선택
                    </label>
                    {toneList.map((tone, idx) => (
                      <div
                        key={tone.toneId}
                        className="flex flex-col w-full mt-3 bg-white rounded-md px-3 py-2 shadow-sm border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="tone"
                              id={`tone-${tone.toneId}`}
                              value={tone.toneName}
                              checked={selectedTone === tone.toneName}
                              onChange={() => setSelectedTone(tone.toneName)}
                              className="size-4 accent-indigo-600"
                            />
                            <label
                              htmlFor={`tone-${tone.toneId}`}
                              className="text-black text-sm"
                            >
                              {tone.toneName}
                            </label>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setPreviewModal({ isOpen: true, tone })
                            }
                            className="rounded-md bg-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
                          >
                            미리보기
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {keywordError && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                    {keywordError}
                  </div>
                )}

                <div className="flex gap-6 mt-6">
                  <button
                    type="button"
                    className="flex-1 rounded-md bg-gray-400 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
                    onClick={() => setOpen(true)}
                  >
                    키워드 분석 열기
                  </button>
                  <button
                    id="keyword-analysis-button"
                    type="button"
                    onClick={handleAnalyzeKeywords}
                    disabled={loading}
                    className={`flex-1 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {loading ? '키워드 생성 중...' : '키워드 생성하기'}
                  </button>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    키워드 추가
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddKeyword();
                        }
                      }}
                      placeholder="키워드를 직접 추가하세요"
                      className="flex-grow rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyword}
                      className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      추가
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {keywords.map((kw, idx) => (
                      <span
                        key={`${kw}-${idx}`}
                        className="flex items-center gap-1 bg-indigo-500 text-white text-sm px-3 py-1 rounded-full"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(kw)}
                          className="text-gray-200 hover:text-white"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {postError && (
                  <div className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                    {postError}
                  </div>
                )}

                <div className="flex gap-6 pt-6 mt-6">
                  <button
                    type="button"
                    onClick={handleTempSave}
                    disabled={loading}
                    className={`w-full rounded-md px-4 py-2 text-sm font-medium shadow-sm ${loading ? 'bg-gray-500 cursor-not-allowed text-white' : 'bg-gray-400 hover:bg-gray-300 text-gray-800'}`}
                  >
                    {loading ? '저장 중...' : '저장'}
                  </button>
                  <button
                    id="generate-post-button"
                    type="button"
                    onClick={handleGeneratePost}
                    disabled={loading}
                    className={`w-full rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${loading ? 'bg-indigo-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    {loading ? '글 생성 중...' : '글 생성하기'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </>
    </BasicLayout>
  );
};

export default Write1;
