import { useEffect, useState } from 'react';
import { api } from '../api';
import type { SchoolDetailResponse, SchoolSummaryResponse } from '../types';
import './SchoolListPage.css';

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

export default function SchoolListPage() {
  const [schools, setSchools] = useState<SchoolSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('전체');
  const [dormOnly, setDormOnly] = useState(false);
  const [detailSchool, setDetailSchool] = useState<SchoolDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    api.getAllSchools()
      .then(setSchools)
      .catch(() => setError('학교 목록을 불러오지 못했어요.'))
      .finally(() => setLoading(false));
  }, []);

  const openDetail = async (schoolId: string) => {
    setDetailLoading(true);
    setDetailSchool(null);
    try {
      const res = await api.getSchoolDetail(schoolId);
      setDetailSchool(res);
    } finally {
      setDetailLoading(false);
    }
  };

  const locations = ['전체', ...Array.from(new Set(schools.map(s => s.location)))];

  const filtered = schools.filter(s => {
    const matchSearch = s.schoolName.includes(search) || s.industryField.includes(search);
    const matchLocation = selectedLocation === '전체' || s.location === selectedLocation;
    const matchDorm = !dormOnly || s.hasDormitory;
    return matchSearch && matchLocation && matchDorm;
  });

  return (
    <div className="school-list-page">
      <div className="school-list-inner">
        <div className="school-list-header">
          <h2>🏫 전체 학교 목록</h2>
          <p>특성화고·마이스터고를 자유롭게 검색해보세요</p>
        </div>

        <div className="school-list-filters">
          <input
            className="school-search"
            type="text"
            placeholder="학교명 또는 분야 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="location-filter">
            {locations.map(loc => (
              <button
                key={loc}
                className={`filter-btn ${selectedLocation === loc ? 'active' : ''}`}
                onClick={() => setSelectedLocation(selectedLocation === loc ? '전체' : loc)}
              >
                {loc === '전체' ? loc : `${getLocationEmoji(loc)} ${loc}`}
              </button>
            ))}
          </div>
          <label className="dorm-toggle">
            <input
              type="checkbox"
              checked={dormOnly}
              onChange={(e) => setDormOnly(e.target.checked)}
            />
            🏠 기숙사 있는 학교만
          </label>
        </div>

        {loading && (
          <div className="loading-box"><div className="spinner" /><p>불러오는 중...</p></div>
        )}
        {error && (
          <div className="error-box"><p>⚠️ {error}</p></div>
        )}

        {!loading && !error && (
          <>
            <p className="schools-count">총 {filtered.length}개 학교</p>
            <div className="schools-grid">
              {filtered.map(school => (
                <div key={school.schoolId} className="school-card" onClick={() => openDetail(school.schoolId)}>
                  <div className="school-loc-emoji">{school.icon}</div>
                  <h3 className="school-name">{school.schoolName}</h3>
                  <div className="school-tags">
                    <span className="tag tag-location">📍 {school.location}</span>
                    <span className="tag tag-field">🏭 {school.industryField}</span>
                    {school.hasDormitory && <span className="tag tag-dorm">🏠 기숙사</span>}
                  </div>
                  <div className="school-meta">
                    {school.capacity > 0 && <span>정원 {school.capacity}명</span>}
                    {school.competitionRate && <span>경쟁률 {school.competitionRate}</span>}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="empty-msg">검색 결과가 없어요 😢</p>
              )}
            </div>
          </>
        )}
      </div>

      {(detailLoading || detailSchool) && (
        <div className="compare-modal-overlay" onClick={() => setDetailSchool(null)}>
          <div className="compare-modal detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="compare-modal-header">
              <h3>학교 상세 정보</h3>
              <button className="compare-close-btn" onClick={() => setDetailSchool(null)}>✕</button>
            </div>
            {detailLoading && <div className="loading-box"><div className="spinner" /></div>}
            {detailSchool && (
              <div className="detail-body">
                <div className="detail-hero">
                  <span className="detail-emoji">{detailSchool.icon}</span>
                  <div>
                    <h4 className="detail-name">{detailSchool.schoolName}</h4>
                    <p className="detail-sub">📍 {detailSchool.location} · 🏭 {detailSchool.industryField}</p>
                  </div>
                </div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">기숙사</span>
                    <span className="detail-value">{detailSchool.hasDormitory ? '✅ 있음' : '❌ 없음'}</span>
                  </div>
                  {detailSchool.capacity > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">정원</span>
                      <span className="detail-value">{detailSchool.capacity}명</span>
                    </div>
                  )}
                  {detailSchool.competitionRate && (
                    <div className="detail-item">
                      <span className="detail-label">경쟁률</span>
                      <span className="detail-value">{detailSchool.competitionRate}</span>
                    </div>
                  )}
                </div>
                {detailSchool.mainJobs.length > 0 && (
                  <div className="detail-section">
                    <span className="detail-label">주요 직업</span>
                    <div className="compare-tags" style={{ marginTop: '0.4rem' }}>
                      {detailSchool.mainJobs.map(j => (
                        <span key={j} className="tag tag-location">{j}</span>
                      ))}
                    </div>
                  </div>
                )}
                {detailSchool.jobFields.length > 0 && (
                  <div className="detail-section">
                    <span className="detail-label">직업군</span>
                    <div className="compare-tags" style={{ marginTop: '0.4rem' }}>
                      {detailSchool.jobFields.map(f => (
                        <span key={f} className="tag tag-field">{f}</span>
                      ))}
                    </div>
                  </div>
                )}
                {detailSchool.website && (
                  <a className="detail-website-btn" href={detailSchool.website} target="_blank" rel="noreferrer">
                    홈페이지 바로가기 →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
