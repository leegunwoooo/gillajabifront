import { useEffect, useState } from 'react';
import { api } from '../api';
import type { SchoolSummaryResponse } from '../types';
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

interface Props {
  onViewDetail: (schoolId: string) => void;
}

export default function SchoolListPage({ onViewDetail }: Props) {
  const [schools, setSchools] = useState<SchoolSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('전체');
  const [dormOnly, setDormOnly] = useState(false);

  useEffect(() => {
    api.getAllSchools()
      .then(setSchools)
      .catch(() => setError('학교 목록을 불러오지 못했어요.'))
      .finally(() => setLoading(false));
  }, []);

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
          <p>고등학교를 자유롭게 검색해보세요</p>
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
                <div key={school.schoolId} className="school-card" onClick={() => onViewDetail(school.schoolId)}>
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

    </div>
  );
}
