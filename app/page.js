"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [typewriterFinished, setTypewriterFinished] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [assessmentStep, setAssessmentStep] = useState(-1); // -1: closed, 0+: current question
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [typedChars, setTypedChars] = useState([]);
  const [activeBg, setActiveBg] = useState("hero");

  const quoteText = "Hai ngày quan trọng nhất đời người là ngày bạn sinh ra và ngày bạn tìm ra lý do tại sao mình tồn tại.";
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const heroRef = useRef(null);

  // --- Questions Data ---
  const questions = [
    { id: 'role', model: 'CÁ NHÂN', type: 'choice', text: 'Bạn hiện đang là:', options: ['Học sinh', 'Sinh viên', 'Người đi làm'] },
    { id: 'subjects', model: 'HỌC TẬP', type: 'text', text: 'Các môn học bạn thấy mình học tốt là gì?', condition: (ans) => ans.role === 'Học sinh' },
    { id: 'major', model: 'CHUYÊN NGÀNH', type: 'text', text: 'Bạn đang học ngành gì?', condition: (ans) => ans.role === 'Sinh viên' },
    { id: 'position', model: 'CÔNG VIỆC', type: 'text', text: 'Bạn đã/ đang ở vị trí công việc nào?', condition: (ans) => ans.role === 'Người đi làm' },
    { id: 'education', model: 'HỌC VẤN', type: 'choice', text: 'Trình độ học vấn cao nhất của bạn:', options: ['Tiểu học', 'THCS', 'THPT', 'Trung cấp', 'Cao đẳng', 'Đại học', 'Thạc sĩ', 'Tiến sĩ'], condition: (ans) => ans.role === 'Người đi làm' },
    { id: 'skills', model: 'KỸ NĂNG', type: 'text', text: 'Bạn có những kĩ năng nổi bật nào?' },
    { id: 'interests', model: 'QUAN TÂM', type: 'text', text: 'Bạn có mối quan tâm đặc biệt với các lĩnh vực nào?' }
  ];

  const visibleQuestions = questions.filter(q => !q.condition || q.condition(userAnswers));

  // --- Typewriter Effect ---
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedChars(prev => [...prev, quoteText[index]]);
      index++;
      if (index >= quoteText.length) {
        clearInterval(interval);
        setTimeout(() => {
          setTypewriterFinished(true);
          document.body.style.overflowY = 'auto';
        }, 500);
      }
    }, 40);
    
    document.body.style.overflowY = 'hidden';
    return () => clearInterval(interval);
  }, []);

  // --- Scroll & Background Observers ---
  useEffect(() => {
    const handleScroll = () => {
      setIsPastHero(window.scrollY > 100);
    };

    const bgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.id === "hero") setActiveBg("hero");
          if (entry.target.id === "features") setActiveBg("features");
          if (entry.target.id === "steps") setActiveBg("steps");
        }
      });
    }, { threshold: 0.2 });

    if (heroRef.current) bgObserver.observe(heroRef.current);
    if (featuresRef.current) bgObserver.observe(featuresRef.current);
    if (stepsRef.current) bgObserver.observe(stepsRef.current);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      bgObserver.disconnect();
    };
  }, []);

  // --- Handlers ---
  const handleStart = () => {
    if (!isPastHero && typewriterFinished) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      setAssessmentStep(0);
      setUserAnswers({});
    }
  };

  const handleChoice = (qId, val) => {
    setUserAnswers(prev => ({ ...prev, [qId]: val }));
    setTimeout(() => {
      if (assessmentStep < visibleQuestions.length - 1) {
        setAssessmentStep(prev => prev + 1);
      }
    }, 400);
  };

  return (
    <main className="font-sans">
      {/* Background Layers */}
      <div className="bg-gradient-layer" style={{ opacity: activeBg === "hero" ? 1 : 0, background: "var(--bg-hero)" }} />
      <div className="bg-gradient-layer" style={{ opacity: activeBg === "features" ? 1 : 0, background: "var(--bg-features)" }} />
      <div className="bg-gradient-layer" style={{ opacity: activeBg === "steps" ? 1 : 0, background: "var(--bg-steps)" }} />

      <header className="main-header">
        <Image src="/Thiết kế chưa có tên.png" alt="Logo" width={120} height={120} className="main-logo" />
      </header>

      {/* Floating Nav */}
      <nav className={`floating-nav ${typewriterFinished ? "visible" : ""} ${!isPastHero ? "hero-mode" : ""}`}>
        {isPastHero && (
          <>
            <a href="#features" className="nav-link">Giới thiệu</a>
            <a href="#steps" className="nav-link">Hành trình</a>
          </>
        )}
        <button className="nav-btn-dynamic" onClick={handleStart}>
          <span className="btn-text">
            {!isPastHero ? "CUỘN ĐỂ XEM THÊM" : "BẮT ĐẦU"}
          </span>
          {!isPastHero && (
            <div className="icon-small">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </div>
          )}
        </button>
      </nav>

      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="quote-section">
        <div className="quote-wrapper">
          <span className={`quote-icon-top ${typedChars.length > 0 ? "visible" : ""}`}>“</span>
          <h1 className="quote-text">
            {typedChars.join("")}
          </h1>
          <span className={`quote-icon-bottom ${typewriterFinished ? "visible" : ""}`}>”</span>
          <p className="author" style={{ opacity: typewriterFinished ? 1 : 0, transition: "opacity 1s" }}>_Mark Twain_</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className={`features-section ${activeBg !== "hero" ? "visible" : ""}`}>
        <div className="container">
          <h2 className="features-title">Keyreer có gì?</h2>
          <div className="features-list">
            {[
              { t: "Thị Trường Việt Nam", d: "Thiết kế chuyên biệt cho văn hóa bản địa." },
              { t: "Đa Mô Hình Khoa Học", d: "Kết hợp RIASEC, Big Five và Schwartz." },
              { t: "Lộ Trình Đột Phá", d: "Chiến lược chi tiết dựa trên dữ liệu thực tế." }
            ].map((f, i) => (
              <div key={i} className="feature-item">
                <div className="feature-tick">✓</div>
                <div className="feature-content"><strong>{f.t}:</strong> {f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="steps" ref={stepsRef} className="steps-section">
        <div className="container">
          <h2 className="steps-title">Hành trình 3 bước</h2>
          <div className="steps-grid">
            {[
              { n: "01", h: "Thấu hiểu", d: "Điểm mạnh và đam mê qua mô hình khoa học." },
              { n: "02", h: "Định vị", d: "Kết nối bản sắc cá nhân với cơ hội nghề nghiệp." },
              { n: "03", h: "Tìm hướng đi", d: "Xây dựng kế hoạch hành động chi tiết." }
            ].map((s, i) => (
              <div key={i} className="step-card item-card">
                <div className="step-number">{s.n}</div>
                <h3 className="step-heading">{s.h}</h3>
                <p className="step-desc">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Overlay */}
      {assessmentStep >= 0 && (
        <div className="overlay-container active">
          <div className="assessment-card">
            <button className="btn-close" onClick={() => setAssessmentStep(-1)}>×</button>
            <h2 className="assessment-main-title">Giới thiệu bản thân</h2>
            <div className="progress-bar">
              <div style={{ width: `${((assessmentStep + 1) / visibleQuestions.length) * 100}%` }} id="progress-fill" />
            </div>
            
            <div className="question-content">
              <span className="category-badge">{visibleQuestions[assessmentStep].model}</span>
              <h2 className="question-text">{visibleQuestions[assessmentStep].text}</h2>
              {visibleQuestions[assessmentStep].type === "choice" ? (
                <div className="options-container">
                  {visibleQuestions[assessmentStep].options.map(opt => (
                    <div 
                      key={opt} 
                      className={`choice-item ${userAnswers[visibleQuestions[assessmentStep].id] === opt ? "selected" : ""}`}
                      onClick={() => handleChoice(visibleQuestions[assessmentStep].id, opt)}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              ) : (
                <textarea 
                  className="neo-input" 
                  value={userAnswers[visibleQuestions[assessmentStep].id] || ""}
                  onChange={(e) => setUserAnswers(prev => ({ ...prev, [visibleQuestions[assessmentStep].id]: e.target.value }))}
                />
              )}
            </div>

            <div className="assessment-nav" style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button disabled={assessmentStep === 0} onClick={() => setAssessmentStep(prev => prev - 1)} className="btn-premium" style={{ background: "white" }}>Quay lại</button>
              <button 
                onClick={() => assessmentStep < visibleQuestions.length - 1 ? setAssessmentStep(prev => prev + 1) : setShowResults(true)} 
                className="btn-premium"
              >
                {assessmentStep === visibleQuestions.length - 1 ? "KẾT QUẢ" : "Tiếp theo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Overlay */}
      {showResults && (
        <div className="overlay-container active">
          <div className="results-card">
            <button className="btn-close" onClick={() => { setShowResults(false); setAssessmentStep(-1); }}>×</button>
            <h2 className="features-title" style={{ fontSize: "2rem" }}>KẾT QUẢ CỦA BẠN</h2>
            <div className="results-summary">
              {Object.entries(userAnswers).map(([id, val]) => (
                <div key={id} className="summary-item">
                  <span className="summary-label">{questions.find(q => q.id === id)?.text}</span>
                  <p className="summary-value">{val}</p>
                </div>
              ))}
            </div>
            <button className="btn-premium" onClick={() => { setShowResults(false); setAssessmentStep(0); }}>Làm lại</button>
          </div>
        </div>
      )}
    </main>
  );
}
