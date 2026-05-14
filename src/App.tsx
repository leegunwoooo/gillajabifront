import { useState } from 'react';
import type { AptitudeResultResponse, JobRecommendResponse } from './types';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import ResultPage from './pages/ResultPage';
import SchoolsPage from './pages/SchoolsPage';
import './App.css';

type Screen = 'home' | 'test' | 'result' | 'schools';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [result, setResult] = useState<AptitudeResultResponse | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobRecommendResponse | null>(null);

  const handleResult = (r: AptitudeResultResponse) => {
    setResult(r);
    setScreen('result');
  };

  const handleSelectJob = (job: JobRecommendResponse) => {
    setSelectedJob(job);
    setScreen('schools');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <button className="logo" onClick={() => setScreen('home')}>
            <span>🧭</span>
            <span>길라잡이</span>
          </button>
          <nav>
            <button className="nav-link" onClick={() => setScreen('home')}>홈</button>
            <button className="nav-link nav-cta" onClick={() => setScreen('test')}>적성 검사</button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {screen === 'home' && (
          <HomePage onStart={() => setScreen('test')} />
        )}
        {screen === 'test' && (
          <TestPage
            onBack={() => setScreen('home')}
            onResult={handleResult}
          />
        )}
        {screen === 'result' && result && (
          <ResultPage
            result={result}
            onSelectJob={handleSelectJob}
            onRetry={() => setScreen('test')}
          />
        )}
        {screen === 'schools' && selectedJob && (
          <SchoolsPage
            job={selectedJob}
            onBack={() => setScreen('result')}
            onRetry={() => setScreen('test')}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>🧭 길라잡이 — 중학생을 위한 특성화·마이스터고 추천 서비스</p>
      </footer>
    </div>
  );
}
