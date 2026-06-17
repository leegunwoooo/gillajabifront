import { useEffect, useState } from 'react';
import { api } from '../api';
import type {
  AdmissionScoreRequest,
  AdmissionScoreResponse,
  Achievement,
  Certificate,
  SchoolDetailResponse,
  SubjectScore,
} from '../types';
import './SchoolDetailPage.css';

interface Props {
  schoolId: string;
  onBack: () => void;
}

const ACHIEVEMENT_OPTIONS: Achievement[] = ['A', 'B', 'C', 'D', 'E'];
const CERTIFICATE_OPTIONS: { value: Certificate; label: string }[] = [
  { value: 'NONE', label: '없음' },
  { value: 'INFORMATION_PROCESSING', label: '정보처리기능사' },
  { value: 'INFORMATION_DEVICE_OPERATION', label: '정보기기운용기능사' },
  { value: 'ELECTRONIC_COMPUTER', label: '전자계산기기능사' },
  { value: 'COMPUTER_USAGE_1', label: '컴퓨터활용능력 1급' },
  { value: 'COMPUTER_USAGE_2', label: '컴퓨터활용능력 2급' },
  { value: 'COMPUTER_USAGE_3', label: '컴퓨터활용능력 3급' },
];

type SemesterKey = 'grade2Semester1' | 'grade2Semester2' | 'grade3Semester1';
const SEMESTER_LABELS: Record<SemesterKey, string> = {
  grade2Semester1: '2학년 1학기',
  grade2Semester2: '2학년 2학기',
  grade3Semester1: '3학년 1학기',
};

function emptySubject(): SubjectScore {
  return { subjectName: '', achievement: 'B', mathSubject: false }; // mathSubject always false (no 2x weighting)
}

function emptyRequest(): AdmissionScoreRequest {
  return {
    grade2Semester1: [emptySubject()],
    grade2Semester2: [emptySubject()],
    grade3Semester1: [emptySubject()],
    unauthorizedAbsenceDays: 0,
    unauthorizedTardyCount: 0,
    unauthorizedEarlyLeaveCount: 0,
    unauthorizedMissedClassCount: 0,
    volunteerHours: 0,
    certificate: 'NONE',
  };
}

export default function SchoolDetailPage({ schoolId, onBack }: Props) {
  const [school, setSchool] = useState<SchoolDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [calcOpen, setCalcOpen] = useState(false);
  const [form, setForm] = useState<AdmissionScoreRequest>(emptyRequest());
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState('');
  const [calcResult, setCalcResult] = useState<AdmissionScoreResponse | null>(null);

  useEffect(() => {
    api.getSchoolDetail(schoolId)
      .then(setSchool)
      .catch(() => setError('학교 정보를 불러오지 못했어요.'))
      .finally(() => setLoading(false));
  }, [schoolId]);

  const updateSubject = (sem: SemesterKey, idx: number, field: keyof SubjectScore, value: string | boolean) => {
    setForm(prev => {
      const subjects = [...prev[sem]];
      subjects[idx] = { ...subjects[idx], [field]: value };
      return { ...prev, [sem]: subjects };
    });
  };

  const addSubject = (sem: SemesterKey) => {
    setForm(prev => ({ ...prev, [sem]: [...prev[sem], emptySubject()] }));
  };

  const removeSubject = (sem: SemesterKey, idx: number) => {
    setForm(prev => {
      const subjects = prev[sem].filter((_, i) => i !== idx);
      return { ...prev, [sem]: subjects.length ? subjects : [emptySubject()] };
    });
  };

  const handleCalc = async () => {
    setCalcLoading(true);
    setCalcError('');
    setCalcResult(null);
    try {
      const res = await api.calculateAdmissionScore(schoolId, form);
      setCalcResult(res);
    } catch {
      setCalcError('점수 계산에 실패했어요. 다시 시도해주세요.');
    } finally {
      setCalcLoading(false);
    }
  };

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

            {/* Admission Score Calculator */}
            <div className="sd-calc-section">
              <button
                className="sd-calc-toggle"
                onClick={() => setCalcOpen(v => !v)}
              >
                <span>📊 입학 점수 계산기</span>
                <span className="sd-calc-toggle-arrow">{calcOpen ? '▲' : '▼'}</span>
              </button>

              {calcOpen && (
                <div className="sd-calc-body">
                  <p className="sd-calc-desc">
                    성적, 출결, 봉사시간, 자격증을 입력하면 예상 입학 점수를 계산해드려요.
                  </p>

                  {/* Subject Grades per Semester */}
                  {(Object.keys(SEMESTER_LABELS) as SemesterKey[]).map(sem => (
                    <div key={sem} className="sd-calc-group">
                      <h4 className="sd-calc-group-title">{SEMESTER_LABELS[sem]} 성적</h4>
                      {form[sem].map((subj, idx) => (
                        <div key={idx} className="sd-subject-row">
                          <input
                            className="sd-input sd-input-name"
                            type="text"
                            placeholder="과목명"
                            value={subj.subjectName}
                            onChange={e => updateSubject(sem, idx, 'subjectName', e.target.value)}
                          />
                          <select
                            className="sd-select"
                            value={subj.achievement}
                            onChange={e => updateSubject(sem, idx, 'achievement', e.target.value as Achievement)}
                          >
                            {ACHIEVEMENT_OPTIONS.map(a => (
                              <option key={a} value={a}>{a}</option>
                            ))}
                          </select>
                          {form[sem].length > 1 && (
                            <button
                              className="sd-remove-btn"
                              onClick={() => removeSubject(sem, idx)}
                              title="삭제"
                            >✕</button>
                          )}
                        </div>
                      ))}
                      <button className="sd-add-btn" onClick={() => addSubject(sem)}>+ 과목 추가</button>
                    </div>
                  ))}

                  {/* Attendance */}
                  <div className="sd-calc-group">
                    <h4 className="sd-calc-group-title">출결 사항 (미인정)</h4>
                    <div className="sd-attendance-grid">
                      {[
                        { key: 'unauthorizedAbsenceDays' as const, label: '결석 (일)' },
                        { key: 'unauthorizedTardyCount' as const, label: '지각 (회)' },
                        { key: 'unauthorizedEarlyLeaveCount' as const, label: '조퇴 (회)' },
                        { key: 'unauthorizedMissedClassCount' as const, label: '결과 (회)' },
                      ].map(({ key, label }) => (
                        <label key={key} className="sd-number-label">
                          <span>{label}</span>
                          <input
                            className="sd-input sd-input-number"
                            type="number"
                            min={0}
                            value={form[key]}
                            onChange={e => setForm(prev => ({ ...prev, [key]: Math.max(0, Number(e.target.value)) }))}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Volunteer & Certificate */}
                  <div className="sd-calc-group">
                    <h4 className="sd-calc-group-title">봉사 및 자격증</h4>
                    <div className="sd-extra-row">
                      <label className="sd-number-label">
                        <span>봉사시간 (시간)</span>
                        <input
                          className="sd-input sd-input-number"
                          type="number"
                          min={0}
                          value={form.volunteerHours}
                          onChange={e => setForm(prev => ({ ...prev, volunteerHours: Math.max(0, Number(e.target.value)) }))}
                        />
                      </label>
                      <label className="sd-number-label">
                        <span>자격증</span>
                        <select
                          className="sd-select sd-select-cert"
                          value={form.certificate}
                          onChange={e => setForm(prev => ({ ...prev, certificate: e.target.value as Certificate }))}
                        >
                          {CERTIFICATE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  {calcError && <p className="sd-calc-error">{calcError}</p>}

                  <button
                    className="btn btn-primary sd-calc-submit"
                    onClick={handleCalc}
                    disabled={calcLoading}
                  >
                    {calcLoading ? '계산 중...' : '📊 점수 계산하기'}
                  </button>

                  {calcResult && (
                    <div className="sd-calc-result">
                      <div className="sd-result-header">
                        <h4>{calcResult.schoolName}</h4>
                        <span className="sd-result-type">{calcResult.admissionType}</span>
                      </div>
                      <div className="sd-result-score">
                        <span className="sd-result-total">{calcResult.totalScore.toFixed(1)}</span>
                        <span className="sd-result-max">/ {calcResult.maxTotalScore}점</span>
                      </div>
                      <div className="sd-result-bar-wrap">
                        <div
                          className="sd-result-bar"
                          style={{ width: `${(calcResult.totalScore / calcResult.maxTotalScore) * 100}%` }}
                        />
                      </div>
                      <div className="sd-breakdown">
                        {[
                          { label: '교과 성적', score: calcResult.breakdown.subjectScore, max: calcResult.breakdown.maxSubjectScore },
                          { label: '출결', score: calcResult.breakdown.attendanceScore, max: calcResult.breakdown.maxAttendanceScore },
                          { label: '봉사활동', score: calcResult.breakdown.volunteerScore, max: calcResult.breakdown.maxVolunteerScore },
                          { label: '가산점', score: calcResult.breakdown.bonusScore, max: calcResult.breakdown.maxBonusScore },
                        ].map(({ label, score, max }) => (
                          <div key={label} className="sd-breakdown-item">
                            <span className="sd-breakdown-label">{label}</span>
                            <div className="sd-breakdown-bar-wrap">
                              <div
                                className="sd-breakdown-bar"
                                style={{ width: max > 0 ? `${(score / max) * 100}%` : '0%' }}
                              />
                            </div>
                            <span className="sd-breakdown-score">{score.toFixed(1)} / {max}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
