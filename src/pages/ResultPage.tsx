import type { AptitudeResultResponse, JobRecommendResponse } from '../types';
import './ResultPage.css';

interface Props {
  result: AptitudeResultResponse;
  onSelectJob: (job: JobRecommendResponse) => void;
  onRetry: () => void;
}

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
  const recommendedJobs = [...result.recommendedJobs].sort((a, b) => b.matchRate - a.matchRate);
  const categoryScores = aggregateByField(result.categoryScores);
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

          <div className="score-list">
            {scoreEntries.map(([key, score], rank) => {
              const pct = Math.min(Math.round((score / maxScore) * 100), 100);
              const { label, icon } = getMeta(key);
              return (
                <div key={key} className="score-row">
                  <span className="score-label">
                    <span className="score-icon">{icon}</span>
                    {label}
                  </span>
                  <div className="score-track">
                    <div
                      className="score-fill"
                      style={{ width: `${pct}%` }}
                      data-rank={rank}
                    />
                  </div>
                  <span className="score-comment">{getStrengthComment(rank)}</span>
                </div>
              );
            })}
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
