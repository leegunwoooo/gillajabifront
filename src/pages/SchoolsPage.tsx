import { useEffect, useState } from 'react';
import { api } from '../api';
import type { JobRecommendResponse, SchoolRecommendResponse } from '../types';
import './SchoolsPage.css';

interface Props {
  job: JobRecommendResponse;
  onBack: () => void;
  onRetry: () => void;
}

const LOCATION_EMOJI: Record<string, string> = {
  서울: '🏙', 부산: '🌊', 대구: '🏞', 인천: '✈', 광주: '🌿',
  대전: '🔬', 울산: '🏭', 경기: '🏘', 강원: '🏔', 충북: '🌾',
  충남: '🌻', 전북: '🌾', 전남: '🌿', 경북: '🍎', 경남: '🌊',
  제주: '🍊',
};

function getLocationEmoji(location: string) {
  for (const [key, emoji] of Object.entries(LOCATION_EMOJI)) {
    if (location.includes(key)) return emoji;
  }
  return '📍';
}

export default function SchoolsPage({ job, onBack, onRetry }: Props) {
  const [schools, setSchools] = useState<SchoolRecommendResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.recommendSchools(job.jobId)
      .then(setSchools)
      .catch(() => setError('학교 정보를 불러오지 못했어요.'))
      .finally(() => setLoading(false));
  }, [job.jobId]);

  return (
    <div className="schools-page">
      <div className="schools-inner">
        <div className="schools-header">
          <button className="back-btn" onClick={onBack}>← 결과로 돌아가기</button>
          <div className="selected-job">
            <span className="selected-job-icon">{job.icon || '💼'}</span>
            <div>
              <p className="selected-job-label">선택한 직업</p>
              <p className="selected-job-name">{job.jobName}</p>
            </div>
          </div>
          <h2>추천 학교</h2>
          <p>선택한 직업에 맞는 특성화고·마이스터고예요</p>
        </div>

        {loading && (
          <div className="loading-box">
            <div className="spinner" />
            <p>학교 정보를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="error-box">
            <p>⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && schools.length === 0 && (
          <div className="empty-box">
            <p>😢 추천 학교 정보가 없어요.</p>
          </div>
        )}

        {!loading && !error && schools.length > 0 && (
          <>
            <p className="schools-count">총 {schools.length}개 학교</p>
            <div className="schools-grid">
              {schools.map((school, i) => (
                <div key={school.schoolId} className="school-card">
                  <div className="school-rank">#{i + 1}</div>
                  <div className="school-loc-emoji">{getLocationEmoji(school.location)}</div>
                  <h3 className="school-name">{school.schoolName}</h3>
                  <div className="school-tags">
                    <span className="tag tag-location">📍 {school.location}</span>
                    <span className="tag tag-field">🏭 {school.industryField}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="schools-actions">
          <button className="btn btn-outline" onClick={onBack}>다른 직업 보기</button>
          <button className="btn btn-primary" onClick={onRetry}>검사 다시하기</button>
        </div>
      </div>
    </div>
  );
}
