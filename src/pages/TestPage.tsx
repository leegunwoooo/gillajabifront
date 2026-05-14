import { useEffect, useRef, useState } from 'react';
import { api } from '../api';
import type { AptitudeResultResponse, QuestionResponse } from '../types';
import './TestPage.css';

const LABELS = ['전혀 아니다', '아니다', '보통', '그렇다', '매우 그렇다'];
const PER_PAGE = 4;

interface Props {
  onBack: () => void;
  onResult: (result: AptitudeResultResponse) => void;
}

export default function TestPage({ onBack, onResult }: Props) {
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getQuestions()
      .then(setQuestions)
      .catch(() => setError('문항을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(questions.length / PER_PAGE);
  const pageQuestions = questions.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const answeredCount = Object.keys(answers).length;
  const progressPct = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;
  const pageAnswered = pageQuestions.every((q) => answers[q.id] !== undefined);
  const isLastPage = page === totalPages - 1;
  const allAnswered = answeredCount === questions.length && questions.length > 0;

  const handleAnswer = (qId: number, val: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const changePage = (dir: number) => {
    setPage((p) => p + dir);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // 명세: answers 키는 문자열 질문 id, 값은 1~5 정수
      const result = await api.analyze({
        answers: Object.fromEntries(
          Object.entries(answers).map(([k, v]) => [String(k), v])
        ),
      });
      onResult(result);
    } catch {
      setError('분석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="test-page">
        <div className="loading-box">
          <div className="spinner" />
          <p>문항을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-page">
        <div className="error-box">
          <p>⚠️ {error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="test-page" ref={topRef}>
      <div className="test-inner">
        <div className="test-header">
          <button className="back-btn" onClick={onBack}>← 홈으로</button>
          <h2>적성 검사</h2>
          <p>각 문항을 읽고 나에게 해당하는 정도를 선택해주세요</p>
        </div>

        {/* Progress */}
        <div className="progress-wrap">
          <div className="progress-meta">
            <span>{answeredCount} / {questions.length} 답변 완료</span>
            <span>{progressPct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Questions */}
        <div className="questions-list">
          {pageQuestions.map((q, idx) => (
            <div key={q.id} className={`question-card ${answers[q.id] !== undefined ? 'answered' : ''}`}>
              <div className="question-number">Q{page * PER_PAGE + idx + 1}</div>
              <p className="question-text">{q.text}</p>
              <div className="answer-grid">
                {LABELS.map((label, i) => {
                  const val = i + 1;
                  const selected = answers[q.id] === val;
                  return (
                    <button
                      key={val}
                      className={`answer-btn ${selected ? 'selected' : ''}`}
                      onClick={() => handleAnswer(q.id, val)}
                    >
                      <span className="answer-num">{val}</span>
                      <span className="answer-label">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="test-nav">
          <button
            className="btn btn-outline"
            onClick={() => changePage(-1)}
            disabled={page === 0}
          >
            ← 이전
          </button>
          <span className="page-indicator">{page + 1} / {totalPages}</span>
          {isLastPage ? (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
            >
              {submitting ? '분석 중...' : '결과 보기 →'}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => changePage(1)}
              disabled={!pageAnswered}
            >
              다음 →
            </button>
          )}
        </div>

        {isLastPage && !allAnswered && (
          <p className="warning-text">모든 문항에 답해야 결과를 볼 수 있어요</p>
        )}
      </div>
    </div>
  );
}
