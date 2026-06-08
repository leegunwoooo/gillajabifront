import { useState } from 'react';
import type { AptitudeResultResponse, JobRecommendResponse } from '../types';
import './ResultPage.css';

interface Props {
  result: AptitudeResultResponse;
  onSelectJob: (job: JobRecommendResponse) => void;
  onRetry: () => void;
}

const JOB_DESC_MAP: Record<string, string> = {
  SW001: '앱·웹·프로그램을 만드는 소프트웨어 개발자',
  DA001: '데이터를 분석해 인사이트를 도출하는 데이터 분석가',
  AI001: 'AI 모델을 개발·활용하는 인공지능 전문가',
  DE001: '제품·브랜드의 시각적 이미지를 만드는 그래픽 디자이너',
  DE002: 'UI·UX를 설계해 사용자 경험을 디자인하는 전문가',
  MK001: '전략을 세워 조직과 사람을 이끄는 경영·마케팅 전문가',
  RS001: '실험과 탐구로 새로운 것을 발견하는 과학 연구원',
  CC001: '영상·콘텐츠를 기획·제작하는 미디어 크리에이터',
  ME001: '기계를 설계·제조·정비하는 기계 엔지니어',
  EL001: '전기·전자 시스템을 개발·운용하는 전기전자 기술자',
  CK001: '맛있는 요리를 만드는 조리사·셰프',
  AG001: '작물과 동물을 재배·사육하는 농업 전문가',
  AG002: '농산물을 가공·유통하는 식품·농업 전문가',
  MH001: '사람의 건강을 돌보는 의료·보건 전문가',
};

const JOB_FIELD_MAP: Record<string, string> = {
  SW001: 'IT', DA001: 'IT', AI001: 'IT',
  DE001: '디자인', DE002: '디자인',
  MK001: '경영',
  RS001: '과학',
  CC001: '미디어',
  ME001: '기계',
  EL001: '전기/전자',
  CK001: '식품/조리',
  AG001: '농업',
  AG002: '식품/농업',
  MH001: '의료/보건',
};

function resolveField(field: string): string {
  return JOB_FIELD_MAP[field] ?? field;
}

const CATEGORY_META: Record<string, { label: string; icon: string; desc: string }> = {
  IT:          { label: 'IT·소프트웨어',  icon: '💻', desc: '컴퓨터와 기술로 문제를 해결하는 걸 좋아해요' },
  디자인:      { label: '디자인·예술',    icon: '🎨', desc: '아름다운 것을 만드는 감각이 뛰어나요' },
  경영:        { label: '경영·리더십',    icon: '📣', desc: '사람들을 이끌고 계획하는 능력이 있어요' },
  과학:        { label: '과학·탐구',      icon: '🔬', desc: '궁금한 것을 끝까지 파고드는 탐구력이 높아요' },
  미디어:      { label: '미디어·콘텐츠',  icon: '🎬', desc: '나만의 이야기를 표현하는 창의력이 있어요' },
  기계:        { label: '기계·제조',      icon: '⚙️', desc: '손으로 만들고 조립하는 것에 재능이 있어요' },
  '전기/전자': { label: '전기·전자',      icon: '⚡', desc: '전기와 전자 기술에 흥미와 적성이 있어요' },
  '식품/조리': { label: '식품·조리',      icon: '🍳', desc: '맛있는 음식을 만드는 감각과 재능이 있어요' },
  '식품/농업': { label: '식품·농업',      icon: '🥫', desc: '식품 가공과 농업 분야에 관심이 높아요' },
  농업:        { label: '농업·자연',      icon: '🌱', desc: '자연과 생명을 소중히 다루는 마음이 있어요' },
  '의료/보건': { label: '의료·보건',      icon: '🏥', desc: '사람의 건강을 돌보고 싶은 따뜻한 마음이 있어요' },
};

function getMeta(key: string) {
  return CATEGORY_META[key] ?? { label: key, icon: '📌', desc: `${key} 분야에 적성이 있어요` };
}

function getStrengthComment(rank: number): string {
  if (rank === 0) return '가장 강한 분야예요! 🌟';
  if (rank === 1) return '두 번째로 강한 분야예요';
  return '관심을 가져볼 만한 분야예요';
}

function aggregateByField(scores: Record<string, number>): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [key, val] of Object.entries(scores)) {
    const field = JOB_FIELD_MAP[key] ?? key;
    result[field] = (result[field] ?? 0) + val;
  }
  return result;
}

export default function ResultPage({ result, onSelectJob, onRetry }: Props) {
  const [showAllRanks, setShowAllRanks] = useState(false);
  const recommendedJobs = [...result.recommendedJobs].sort((a, b) => b.matchRate - a.matchRate);
  const categoryScores = aggregateByField(result.categoryRates);
  const scoreEntries = Object.entries(categoryScores).sort(([, a], [, b]) => b - a);
  const maxScore = Math.max(...Object.values(categoryScores), 1);

  return (
    <div className="result-page">
      <div className="result-inner">
        <div className="result-header">
          <h2>🎉 검사 결과</h2>
          <p>나의 적성을 분석했어요!</p>
          <button className="retry-btn" onClick={onRetry}>← 다시 검사하기</button>
        </div>

        {/* Category Scores */}
        <div className="result-section">
          <h3 className="result-section-title">✨ 나의 강점 분야</h3>
          <p className="result-hint">점수가 높을수록 그 분야에 더 잘 맞아요</p>

          {/* Top category highlight */}
          {scoreEntries[0] && (() => {
            const { label, icon, desc } = getMeta(scoreEntries[0][0]);
            return (
              <div className="top-category">
                <span className="top-category-icon">{icon}</span>
                <div>
                  <p className="top-category-name">{label}</p>
                  <p className="top-category-desc">{desc}</p>
                </div>
                <span className="top-badge">최고 적성</span>
              </div>
            );
          })()}

          <div className="score-split">
            {/* 왼쪽: 순위 목록 */}
            <div className="score-rank-list">
              {(showAllRanks ? scoreEntries : scoreEntries.slice(0, 3)).map(([key, score], rank) => {
                const { label, icon } = getMeta(key);
                return (
                  <div key={key} className="score-rank-row">
                    <span className="score-rank-num" data-rank={rank}>{rank + 1}등</span>
                    <span className="score-rank-icon">{icon}</span>
                    <span className="score-rank-label">{label}</span>
                    <span className="score-rank-pct">{score}%</span>
                  </div>
                );
              })}
              {scoreEntries.length > 3 && (
                <button className="score-more-btn" onClick={() => setShowAllRanks(v => !v)}>
                  {showAllRanks ? '접기 ▲' : `더 보기 +${scoreEntries.length - 3} ▼`}
                </button>
              )}
            </div>

            {/* 오른쪽: 원형 그래프 하나 (1등 기준) */}
            {(() => {
              const [, topScore] = scoreEntries[0] ?? [];
              const R = 52;
              const CIRC = 2 * Math.PI * R;
              const offset = CIRC * (1 - (topScore ?? 0) / 100);
              return (
                <div className="score-ring-wrap">
                  <svg viewBox="0 0 128 128" width="128" height="128">
                    <circle cx="64" cy="64" r={R} className="score-ring-track" />
                    <circle
                      cx="64" cy="64" r={R}
                      className="score-ring-fill"
                      data-rank={0}
                      style={{ strokeDasharray: CIRC, strokeDashoffset: offset }}
                    />
                  </svg>
                  <div className="score-ring-inner">
                    <span className="score-ring-pct">{topScore ?? 0}%</span>
                    <span className="score-ring-sub">1등</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="result-section">
          <h3 className="result-section-title">💼 추천 직업</h3>
          <p className="result-hint">직업 카드를 클릭하면 관련 고등학교를 추천해드려요</p>
          <div className="jobs-grid">
            {recommendedJobs.map((job) => (
              <button
                key={job.jobId}
                className="job-card"
                onClick={() => onSelectJob(job)}
              >
                <div className="job-icon">{job.icon || '💼'}</div>
                <div className="job-match">
                  <div
                    className="match-ring"
                    style={{ '--pct': job.matchRate } as React.CSSProperties}
                  >
                    <span>{job.matchRate}%</span>
                  </div>
                  <span className="match-label">일치율</span>
                </div>
                <h4 className="job-name">{job.jobName}</h4>
                <span className="job-desc">{JOB_DESC_MAP[job.jobId] ?? ''}</span>
                <span className="job-field">{resolveField(job.field)}</span>
                <span className="job-cta">학교 추천 보기 →</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
