import { useEffect, useState } from 'react';
import { api } from '../api';
import type { JobRecommendResponse, SchoolCompareResponse, SchoolDetailResponse, SchoolRecommendResponse } from '../types';
import './SchoolsPage.css';

interface Props {
  job: JobRecommendResponse;
  onBack: () => void;
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
  const [selectedLocation, setSelectedLocation] = useState<string>('전체');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareResult, setCompareResult] = useState<SchoolCompareResponse | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState('');
  const [detailSchool, setDetailSchool] = useState<SchoolDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  const toggleCompare = (schoolId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(schoolId)) return prev.filter((id) => id !== schoolId);
      if (prev.length >= 2) return [prev[1], schoolId];
      return [...prev, schoolId];
    });
  };

  const openCompare = async () => {
    if (compareIds.length < 2) return;
    setCompareLoading(true);
    setCompareError('');
    try {
      const res = await api.compareSchools(compareIds[0], compareIds[1]);
      setCompareResult(res);
    } catch {
      setCompareError('학교 비교 정보를 불러오지 못했어요.');
    } finally {
      setCompareLoading(false);
    }
  };

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
              {JOB_DESC_MAP[job.jobId] && (
                <p className="selected-job-desc">{JOB_DESC_MAP[job.jobId]}</p>
              )}
            </div>
          </div>
          <h2>추천 학교</h2>
          <p>선택한 직업에 맞는 고등학교예요</p>
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

        {!loading && !error && schools.length > 0 && (() => {
          const locations = ['전체', ...Array.from(new Set(schools.map(s => s.location)))];
          const filtered = selectedLocation === '전체'
            ? schools
            : schools.filter(s => s.location === selectedLocation);

          return (
            <>
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
              <p className="schools-count">
                {selectedLocation === '전체' ? `전체 ${schools.length}개` : `${selectedLocation} ${filtered.length}개`} 학교
              </p>
              <div className="schools-grid">
                {filtered.map((school, i) => {
                  const selected = compareIds.includes(school.schoolId);
                  return (
                    <div key={school.schoolId} className={`school-card ${selected ? 'compare-selected' : ''}`} onClick={() => openDetail(school.schoolId)}>
                      <div className="school-rank">#{i + 1}</div>
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
                      {school.website && (
                        <a className="school-website" href={school.website} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                          홈페이지 →
                        </a>
                      )}
                      <button
                        className={`compare-toggle-btn ${selected ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleCompare(school.schoolId); }}
                      >
                        {selected ? '✓ 비교 선택됨' : '비교하기'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}

        {compareIds.length > 0 && (
          <div className="compare-bar">
            <span className="compare-bar-info">
              {compareIds.length === 1
                ? '학교를 1개 더 선택하면 비교할 수 있어요'
                : '2개 학교가 선택되었어요'}
            </span>
            <div className="compare-bar-actions">
              <button
                className="btn btn-outline compare-clear-btn"
                onClick={() => setCompareIds([])}
              >
                선택 취소
              </button>
              <button
                className="btn btn-primary"
                onClick={openCompare}
                disabled={compareIds.length < 2 || compareLoading}
              >
                {compareLoading ? '불러오는 중...' : '비교 보기'}
              </button>
            </div>
          </div>
        )}

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
                  {detailSchool.mainJobs?.length > 0 && (
                    <div className="detail-section">
                      <span className="detail-label">주요 직업</span>
                      <div className="compare-tags" style={{ marginTop: '0.4rem' }}>
                        {detailSchool.mainJobs.map((j) => (
                          <span key={j} className="tag tag-location">{j}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {detailSchool.jobFields.length > 0 && (
                    <div className="detail-section">
                      <span className="detail-label">직업군</span>
                      <div className="compare-tags" style={{ marginTop: '0.4rem' }}>
                        {detailSchool.jobFields.map((f) => (
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

        {compareResult && (
          <div className="compare-modal-overlay" onClick={() => setCompareResult(null)}>
            <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
              <div className="compare-modal-header">
                <h3>학교 비교</h3>
                <button className="compare-close-btn" onClick={() => setCompareResult(null)}>✕</button>
              </div>
              {compareError && <p className="compare-error">{compareError}</p>}
              {compareResult.aiSummary && (
                <div className="ai-summary">
                  <span className="ai-summary-label">🤖 AI 비교 요약</span>
                  <p className="ai-summary-text">{compareResult.aiSummary}</p>
                </div>
              )}
              <div className="compare-columns">
                {([compareResult.school1, compareResult.school2] as const).map((school, idx) => (
                  <div key={school.schoolId} className={`compare-col compare-col-${idx + 1}`}>
                    <div className="compare-col-emoji">{school.icon}</div>
                    <h4 className="compare-col-name">{school.schoolName}</h4>
                    <div className="compare-row">
                      <span className="compare-label">위치</span>
                      <span className="compare-value">📍 {school.location}</span>
                    </div>
                    <div className="compare-row">
                      <span className="compare-label">산업분야</span>
                      <span className="compare-value">🏭 {school.industryField}</span>
                    </div>
                    <div className="compare-row">
                      <span className="compare-label">기숙사</span>
                      <span className="compare-value">{school.hasDormitory ? '✅ 있음' : '❌ 없음'}</span>
                    </div>
                    {school.capacity > 0 && (
                      <div className="compare-row">
                        <span className="compare-label">정원</span>
                        <span className="compare-value">{school.capacity}명</span>
                      </div>
                    )}
                    {school.competitionRate && (
                      <div className="compare-row">
                        <span className="compare-label">경쟁률</span>
                        <span className="compare-value">{school.competitionRate}</span>
                      </div>
                    )}
                    {school.mainJobs?.length > 0 && (
                      <div className="compare-row compare-row-col">
                        <span className="compare-label">주요 직업</span>
                        <div className="compare-tags">
                          {school.mainJobs.map((j) => (
                            <span key={j} className="tag tag-location">{j}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {school.jobFields?.length > 0 && (
                      <div className="compare-row compare-row-col">
                        <span className="compare-label">직업군</span>
                        <div className="compare-tags">
                          {school.jobFields.map((f) => (
                            <span key={f} className="tag tag-field">{f}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="schools-actions">
          <button className="btn btn-outline" onClick={onBack}>다른 직업 보기</button>
          <button className="btn btn-primary" onClick={onRetry}>검사 다시하기</button>
        </div>
      </div>
    </div>
  );
}
