import './HomePage.css';

interface Props {
  onStart: () => void;
}

const features = [
  { step: '01', icon: '📝', title: '적성 검사', desc: '나의 흥미와 성향을 알아보는 간단한 설문에 답해요' },
  { step: '02', icon: '💼', title: '직업 추천', desc: '검사 결과를 바탕으로 나에게 맞는 직업을 추천받아요' },
  { step: '03', icon: '🏫', title: '학교 추천', desc: '직업에 맞는 고등학교를 찾아봐요' },
];

const compareRows = [
  { name: '커리어넷', aptitude: true, job: true, school: false },
  { name: '워크넷', aptitude: false, job: true, school: false },
  { name: '학교알리미', aptitude: false, job: false, school: null },
  { name: '🧭 길라잡이', aptitude: true, job: true, school: true, highlight: true },
];

const sampleJobs = ['💻 소프트웨어 개발자', '⚡ 전기 기술자', '🎨 디자이너', '🔧 기계 엔지니어', '🍳 조리사'];

function SchoolCell({ val }: { val: boolean | null }) {
  if (val === null) return <td>🔍 단순 조회</td>;
  return <td>{val ? '✅' : '❌'}</td>;
}

export default function HomePage({ onStart }: Props) {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">중학생을 위한 진로 탐색 서비스</span>
          <h1 className="hero-title">
            나만의 적성으로<br />
            <span className="highlight">딱 맞는 고등학교</span>를<br />
            찾아봐요
          </h1>
          <p className="hero-desc">
            간단한 적성 검사로 어울리는 직업을 추천받고,<br />
            고등학교까지 한 번에 알아보세요.
          </p>
          <button className="btn btn-primary btn-lg" onClick={onStart}>
            적성 검사 시작하기 →
          </button>
        </div>
        <div className="hero-visual">
          {sampleJobs.map((job, i) => (
            <div key={job} className="job-chip" style={{ animationDelay: `${i * 0.2}s` }}>
              {job}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <p className="section-label">어떻게 도와드릴까요?</p>
        <h2 className="section-title">3단계로 진로를 찾아요</h2>
        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={f.step} className="feature-wrap">
              <div className="feature-card">
                <span className="feature-step">{f.step}</span>
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
              {i < features.length - 1 && <span className="feature-arrow">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Compare */}
      <section className="section compare-section">
        <p className="section-label">길라잡이만의 특징</p>
        <h2 className="section-title">다른 서비스와 무엇이 다를까요?</h2>
        <div className="table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>서비스</th>
                <th>적성 검사</th>
                <th>직업 추천</th>
                <th>고교 추천</th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.name} className={row.highlight ? 'row-highlight' : ''}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.aptitude ? '✅' : '❌'}</td>
                  <td>{row.job ? '✅' : '❌'}</td>
                  <SchoolCell val={row.school} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="center mt-lg">
          <button className="btn btn-primary btn-lg" onClick={onStart}>
            지금 바로 시작하기 →
          </button>
        </div>
      </section>
    </div>
  );
}
