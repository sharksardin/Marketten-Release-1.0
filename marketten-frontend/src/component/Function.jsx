import React, { useState, useEffect } from 'react';
import {
  fetchToneList,
  createTone,
  updateTone,
  deleteTone,
} from '../api/tonelistApi';

const FunctionSettings = () => {
  const [tones, setTones] = useState([]);
  const [newToneName, setNewToneName] = useState('');
  const [newTonePreview, setNewTonePreview] = useState('');
  const [selectedToneIndex, setSelectedToneIndex] = useState(null);
  const [modelVersion, setModelVersion] = useState('GPT-4');

  useEffect(() => {
    const loadTones = async () => {
      try {
        const data = await fetchToneList();
        setTones(data);
      } catch (err) {
        console.error('톤 리스트 불러오기 실패', err);
      }
    };
    loadTones();
  }, []);

  const handleAddTone = async () => {
    if (newToneName && newTonePreview) {
      try {
        const newTone = await createTone({
          toneName: newToneName,
          tonePreview: newTonePreview,
        });
        setTones([...tones, newTone]);
        setNewToneName('');
        setNewTonePreview('');
      } catch (err) {
        console.error('톤 추가 실패', err);
      }
    }
  };

  const handleDeleteTone = async (index) => {
    const toneId = tones[index].toneId;
    try {
      await deleteTone(toneId);
      setTones(tones.filter((_, i) => i !== index));
      if (selectedToneIndex === index) setSelectedToneIndex(null);
    } catch (err) {
      console.error('톤 삭제 실패', err);
    }
  };

  const handlePreviewChange = async (value) => {
    const updatedTones = [...tones];
    const tone = updatedTones[selectedToneIndex];
    tone.tonePreview = value;
    setTones(updatedTones);

    try {
      await updateTone(tone.toneId, {
        toneName: tone.toneName,
        tonePreview: value,
      });
    } catch (err) {
      console.error('미리보기 수정 실패', err);
    }
  };

  return (
    <div className="p-8 space-y-10 bg-[#FFF9E6] min-h-screen text-[#6B3A00]">
      <h1 className="text-3xl font-bold mb-6 text-[#6B3A00]">⚙️ 기능 설정</h1>

      {/* 모델 선택 */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#A35C00]">
          🧠 모델 버전 선택
        </h2>
        <select
          value={modelVersion}
          onChange={(e) => setModelVersion(e.target.value)}
          className="w-60 bg-[#FFFDF3] border border-[#FFD97A] rounded px-3 py-2 text-[#6B3A00] focus:ring-2 focus:ring-[#A35C00]"
        >
          <option value="GPT-4">GPT-4</option>
          <option value="GPT-4 Turbo">GPT-4 Turbo</option>
          <option value="GPT-5">GPT-5</option>
        </select>
        <p className="text-sm text-[#8B5E00]">
          현재 선택된 모델:{' '}
          <span className="text-[#A35C00] font-semibold">{modelVersion}</span>
        </p>
      </section>

      {/* 톤 추가 */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#A35C00]">🗣️ 톤 추가</h2>
        <input
          type="text"
          placeholder="톤 이름을 입력하세요"
          value={newToneName}
          onChange={(e) => setNewToneName(e.target.value)}
          className="w-full bg-[#FFFDF3] text-[#6B3A00] border border-[#FFD97A] rounded px-3 py-2 placeholder-[#B88900] focus:ring-2 focus:ring-[#A35C00]"
        />
        <textarea
          placeholder="미리보기 문장을 입력하세요"
          value={newTonePreview}
          onChange={(e) => setNewTonePreview(e.target.value)}
          className="w-full bg-[#FFFDF3] text-[#6B3A00] border border-[#FFD97A] rounded px-3 py-2 placeholder-[#B88900] focus:ring-2 focus:ring-[#A35C00]"
          rows="3"
        />
        <button
          onClick={handleAddTone}
          className="bg-[#A35C00] hover:bg-[#8C4E00] text-white px-5 py-2 rounded-md font-semibold transition"
        >
          추가
        </button>
      </section>

      {/* 톤 목록 */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#A35C00]">📝 톤 목록</h2>
        <ul className="space-y-2">
          {tones.map((tone, index) => (
            <li
              key={tone.toneId}
              className="flex justify-between items-center bg-white border border-[#FFD97A] px-4 py-3 rounded-md hover:bg-[#FFF2CC] transition"
            >
              <span className="font-medium text-[#6B3A00]">
                {tone.toneName}
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setSelectedToneIndex(
                      selectedToneIndex === index ? null : index
                    )
                  }
                  className="text-sm text-[#A35C00] hover:text-[#8C4E00] font-medium transition"
                >
                  미리보기 수정
                </button>
                <button
                  onClick={() => handleDeleteTone(index)}
                  className="text-sm text-[#D62828] hover:text-[#A30000] font-medium transition"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 미리보기 수정 */}
      {selectedToneIndex !== null && (
        <section className="mt-6 p-5 bg-white border border-[#FFD97A] rounded-md space-y-3">
          <h3 className="text-lg font-semibold text-[#A35C00]">
            ✏️ "{tones[selectedToneIndex].toneName}" 톤 미리보기 수정
          </h3>
          <textarea
            value={tones[selectedToneIndex].tonePreview}
            onChange={(e) => handlePreviewChange(e.target.value)}
            className="w-full bg-[#FFFDF3] text-[#6B3A00] border border-[#FFD97A] rounded px-3 py-2 focus:ring-2 focus:ring-[#A35C00]"
            rows="3"
          />
          <p className="text-sm text-[#8B5E00]">실시간 미리보기:</p>
          <div className="p-4 bg-[#FFFDF3] border border-[#FFD97A] rounded text-[#6B3A00]">
            {tones[selectedToneIndex].tonePreview}
          </div>
        </section>
      )}
    </div>
  );
};

export default FunctionSettings;
