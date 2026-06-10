import { useEffect, useState } from 'react';
import { api } from './api';
import type { AptitudeResultResponse, JobRecommendResponse } from './types';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import ResultPage from './pages/ResultPage';
import SchoolsPage from './pages/SchoolsPage';
import SchoolListPage from './pages/SchoolListPage';
import SchoolChat from './components/SchoolChat';
import './App.css';

type Screen = 'home' | 'test' | 'result' | 'schools' | 'schoolList';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [result, setResult] = useState<AptitudeResultResponse | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobRecommendResponse | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const savedScreen = sessionStorage.getItem('gilajabi_screen') as Screen | null;
    Promise.allSettled([api.getResult(), api.getProgress()]).then(([resultRes, progressRes]) => {
      if (savedScreen === 'result' && resultRes.status === 'fulfilled' && resultRes.value?.recommendedJobs?.length) {
        setResult(resultRes.value);
        setScreen('result');
      } else if (savedScreen === 'test' && progressRes.status === 'fulfilled' && Object.keys(progressRes.value).length > 0) {
        setScreen('test');
      } else if (savedScreen) {
        setScreen(savedScreen);
      } else {
        if (resultRes.status === 'fulfilled' && resultRes.value?.recommendedJobs?.length) {
          setResult(resultRes.value);
          setScreen('result');
        } else if (progressRes.status === 'fulfilled' && Object.keys(progressRes.value).length > 0) {
          setScreen('test');
        }
      }
      setInitializing(false);
    });
  }, []);

  useEffect(() => {
    if (!initializing) sessionStorage.setItem('gilajabi_screen', screen);
  }, [screen, initializing]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const handleResult = (r: AptitudeResultResponse) => {
    setResult(r);
    setScreen('result');
  };

  const handleRetry = () => {
    api.clearResult().catch(() => {});
    setScreen('test');
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
            <button className="nav-link" onClick={() => setScreen('schoolList')}>학교 목록</button>
            <button className="nav-link nav-cta" onClick={() => setScreen('test')}>적성 검사</button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {initializing && <div className="app-init-loader"><div className="spinner" /></div>}
        {!initializing && screen === 'home' && (
          <HomePage onStart={() => setScreen('test')} onOpenChat={() => setChatOpen(true)} />
        )}
        {!initializing && screen === 'test' && (
          <TestPage
            onBack={() => setScreen('home')}
            onResult={handleResult}
          />
        )}
        {!initializing && screen === 'result' && result && (
          <ResultPage
            result={result}
            onSelectJob={handleSelectJob}
            onRetry={handleRetry}
          />
        )}
        {!initializing && screen === 'schools' && selectedJob && (
          <SchoolsPage
            job={selectedJob}
            onBack={() => setScreen('result')}
            onRetry={() => setScreen('test')}
          />
        )}
        {!initializing && screen === 'schoolList' && (
          <SchoolListPage />
        )}
      </main>

      <SchoolChat open={chatOpen} setOpen={setChatOpen} />

      <footer className="app-footer">
        <p>🧭 길라잡이 — 중학생을 위한 특성화·마이스터고 추천 서비스</p>
      </footer>
    </div>
  );
}
