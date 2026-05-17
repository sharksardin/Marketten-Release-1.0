import React, { useState, useEffect } from 'react';
import { getDashboardStats, getReportSummary } from '../api/adminApi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#A35C00', '#FFD97A'];

const DashBoard = () => {
  const [statsData, setStatsData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [stats, summary] = await Promise.all([
          getDashboardStats(),
          getReportSummary(),
        ]);

        const transformedData = {
          daily: {
            visitorStats: stats.daily.visitorStats.map((d) => ({
              name: d.name,
              방문자수: d.value,
            })),
            postStats: stats.daily.postStats,
          },
          weekly: {
            visitorStats: stats.weekly.visitorStats.map((d) => ({
              name: d.name,
              방문자수: d.value,
            })),
            postStats: stats.weekly.postStats,
          },
          monthly: {
            visitorStats: stats.monthly.visitorStats.map((d) => ({
              name: d.name,
              방문자수: d.value,
            })),
            postStats: stats.monthly.postStats,
          },
          yearly: {
            visitorStats: stats.yearly.visitorStats.map((d) => ({
              name: d.name,
              방문자수: d.value,
            })),
            postStats: stats.yearly.postStats,
          },
        };

        setStatsData(transformedData);
        setSummaryData(summary);
        setError(null);
      } catch (err) {
        console.error('대시보드 데이터 로딩 실패:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-[#FFF9E6] min-h-screen text-[#6B3A00]">
        데이터를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-[#FFF9E6] min-h-screen text-red-600">{error}</div>
    );
  }

  const periods = [
    { key: 'daily', title: '일간' },
    { key: 'weekly', title: '주간' },
    { key: 'monthly', title: '월간' },
    { key: 'yearly', title: '연간' },
  ];

  return (
    <div className="p-8 bg-[#FFF9E6] min-h-screen text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-[#6B3A00]">📊 대시보드</h1>
      <p className="text-[#8B5E00] mb-8">
        방문자 수, 사용자 활동, 게시물 통계 등 주요 데이터를 한눈에 확인하세요.
      </p>

      {/* 상단 통계 요약 박스 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-[#FFECC0] p-6 rounded-lg shadow-lg text-center border border-[#FFD97A]">
          <p className="text-[#6B3A00] font-semibold mb-2">총 순 방문자 수</p>
          <p className="text-3xl font-bold text-[#A35C00]">
            {summaryData.totalUniqueVisitors.toLocaleString()}명
          </p>
        </div>
        <div className="bg-[#FFECC0] p-6 rounded-lg shadow-lg text-center border border-[#FFD97A]">
          <p className="text-[#6B3A00] font-semibold mb-2">활성 사용자</p>
          <p className="text-3xl font-bold text-[#A35C00]">
            {summaryData.activeUsers.toLocaleString()}명
          </p>
        </div>
        <div className="bg-[#FFECC0] p-6 rounded-lg shadow-lg text-center border border-[#FFD97A]">
          <p className="text-[#6B3A00] font-semibold mb-2">게시물 수</p>
          <p className="text-3xl font-bold text-[#A35C00]">
            {summaryData.totalFinalPosts.toLocaleString()}개
          </p>
        </div>
      </div>

      {/* 방문자 수 선형 그래프 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-[#6B3A00]">
          📈 방문자 통계
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {periods.map((p) => (
            <div
              key={p.key}
              className="bg-[#FFF3C2] rounded-lg p-6 shadow-lg border border-[#FFD97A]"
            >
              <h3 className="text-lg font-semibold mb-4 text-[#6B3A00]">
                {p.title} 방문자 수
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={statsData[p.key].visitorStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0B85A" />
                  <XAxis dataKey="name" stroke="#A35C00" />
                  <YAxis stroke="#A35C00" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFF9E6',
                      border: '1px solid #FFD97A',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="방문자수"
                    stroke="#A35C00"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>

      {/* 글 통계 원형 그래프 */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[#6B3A00]">
          📝 게시물 통계
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {periods.map((p) => (
            <div
              key={p.key}
              className="bg-[#FFF3C2] rounded-lg p-6 shadow-lg border border-[#FFD97A]"
            >
              <h3 className="text-lg font-semibold mb-4 text-[#6B3A00] text-center">
                {p.title} 글 비율
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statsData[p.key].postStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name} ${value}개 (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statsData[p.key].postStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFF9E6',
                      border: '1px solid #FFD97A',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
