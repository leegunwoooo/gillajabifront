import { useEffect, useState } from 'react';
import { api } from '../api';
import type { SchoolDetailResponse } from '../types';
import './SchoolDetailPage.css';

interface Props {
  schoolId: string;
  onBack: () => void;
}

export default function SchoolDetailPage({ schoolId, onBack }: Props) {
  const [school, setSchool] = useState<SchoolDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getSchoolDetail(schoolId)
      .then(setSchool)
      .catch(() => setError('학교 정보를 불러오지 못했어요.'))
      .finally(() => setLoading(false));
  }, [schoolId]);

  return (
    <div className="school-detail-page">
      <div className="school-detail-inner">
        <button className="back-btn" onClick={onBack}>← 돌아가기</button>

        {loading && (
          <div className="loading-box"><div className="spinner" /><p>불러오는 중...</p></div>
        )}
        {error && (
          <div className="error-box"><p>⚠️ {error}</p></div>
        )}

        {school && (
          <>
            <div className="sd-hero">
              <span className="sd-icon">{school.icon}</span>
              <div className="sd-hero-info">
                <h1 className="sd-name">{school.schoolName}</h1>
                <p className="sd-sub">📍 {school.location} · 🏭 {school.industryField}</p>
              </div>
            </div>

            <div className="sd-cards">
              <div className="sd-card">
                <span className="sd-card-label">기숙사</span>
                <span className="sd-card-value">{school.hasDormitory ? '✅ 있음' : '❌ 없음'}</span>
              </div>
              {school.capacity > 0 && (
                <div className="sd-card">
                  <span className="sd-card-label">정원</span>
                  <span className="sd-card-value">{school.capacity}명</span>
                </div>
              )}
              {school.competitionRate && (
                <div className="sd-card">
                  <span className="sd-card-label">경쟁률</span>
                  <span className="sd-card-value">{school.competitionRate}</span>
                </div>
              )}
            </div>

            {school.mainJobs?.length > 0 && (
              <div className="sd-section">
                <h3 className="sd-section-title">주요 직업</h3>
                <div className="sd-tags">
                  {school.mainJobs.map(j => (
                    <span key={j} className="tag tag-location">{j}</span>
                  ))}
                </div>
              </div>
            )}

            {school.jobFields?.length > 0 && (
              <div className="sd-section">
                <h3 className="sd-section-title">직업군</h3>
                <div className="sd-tags">
                  {school.jobFields.map(f => (
                    <span key={f} className="tag tag-field">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {school.website && (
              <a className="sd-website-btn" href={school.website} target="_blank" rel="noreferrer">
                🌐 홈페이지 바로가기 →
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
