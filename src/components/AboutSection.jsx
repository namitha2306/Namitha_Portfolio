import React from 'react';
import { Cpu, Eye, MessageSquareCode, Sparkles, FileText, Network, Layout, GraduationCap, Award, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  const focusAreas = [
    { title: 'Machine Learning & Deep Learning', icon: <Cpu size={20} /> },
    { title: 'Computer Vision', icon: <Eye size={20} /> },
    { title: 'Natural Language Processing', icon: <MessageSquareCode size={20} /> },
    { title: 'LLMs & Prompt Engineering', icon: <Sparkles size={20} /> },
    { title: 'OCR & Document Intelligence', icon: <FileText size={20} /> },
    { title: 'Multi-Agent AI Systems', icon: <Network size={20} /> },
    { title: 'Full-Stack Development', icon: <Layout size={20} /> },
    { title: 'UI/UX & Visual Design', icon: <Layout size={20} /> }
  ];

  const coursework = [
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Artificial Intelligence',
    'Multi-Agent AI Systems',
    'Linear Algebra and Statistics',
    'Data Structures and Algorithms',
    'Database Systems'
  ];

  return (
    <section id="about" className="section-container" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div className="max-w-6xl mx-auto">
        {/* ABOUT ME */}
        <div style={{ fontSize: '0.85rem', fontFamily: "'Fira Code', monospace", color: '#CC2A25', letterSpacing: '2px', marginBottom: '8px' }}>
          01 // OVERVIEW
        </div>
        <h2 className="section-title">ABOUT ME</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          <div>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-primary)', marginBottom: '20px', fontWeight: 500 }}>
              I am an Integrated MSc Computer Science student specializing in Artificial Intelligence and Data Science at Cochin University of Science and Technology (CUSAT).
            </p>
            <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '20px' }}>
              I have gained industry and research experience through internships at Pixl.AI, NIT Calicut, and Pix Dynamics, where I worked on deepfake detection, medical computer vision, document processing, image denoising, and AI-based systems.
            </p>
            <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '28px' }}>
              I also enjoy turning complex technical ideas into simple, engaging visual experiences through UI/UX design and creative work.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ padding: '10px 18px', borderRadius: '16px', background: 'rgba(30, 24, 18, 0.7)', border: '1px solid rgba(204, 42, 37, 0.28)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>Pixl.AI</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI Engineer Intern</div>
              </div>
              <div style={{ padding: '10px 18px', borderRadius: '16px', background: 'rgba(30, 24, 18, 0.7)', border: '1px solid rgba(204, 42, 37, 0.28)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>NIT Calicut</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Research Intern</div>
              </div>
              <div style={{ padding: '10px 18px', borderRadius: '16px', background: 'rgba(30, 24, 18, 0.7)', border: '1px solid rgba(204, 42, 37, 0.28)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>Pix Dynamics</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Student Intern</div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', color: '#ffffff' }}>
              Core Technical & Design Focus Areas:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {focusAreas.map((item, idx) => (
                <div key={idx} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: '#CC2A25', flexShrink: 0 }}>{item.icon}</div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EDUCATION */}
        <div style={{ marginTop: '80px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '60px' }}>
          <div style={{ fontSize: '0.85rem', fontFamily: "'Fira Code', monospace", color: '#CC2A25', letterSpacing: '2px', marginBottom: '8px' }}>
            02 // ACADEMICS
          </div>
          <h2 className="section-title">EDUCATION</h2>

          <div className="cards-grid">
            <div className="card" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: "'Fira Code', monospace", color: '#8CB414', fontWeight: 600 }}>
                  2021 – Present | Kochi, Kerala, India
                </span>
                <GraduationCap size={24} style={{ color: '#CC2A25' }} />
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>Cochin University of Science and Technology — CUSAT</h3>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Integrated MSc in Computer Science (Specialization: Artificial Intelligence and Data Science)
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ padding: '14px 24px', background: 'rgba(204, 42, 37, 0.10)', borderRadius: '12px', border: '1px solid rgba(204, 42, 37, 0.35)' }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8, color: '#CC2A25' }}>CGPA</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>8.44 / 10</div>
                </div>
              </div>

              <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '12px', color: '#ffffff' }}>Relevant Coursework:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {coursework.map((c, i) => (
                  <span key={i} style={{ padding: '6px 14px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '14px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.78rem', fontFamily: "'Fira Code', monospace", color: '#8CB414', marginBottom: '8px' }}>
                2018 – 2020
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>St. Joseph's CGHSS, Thrissur</h4>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Higher Secondary Education — Kerala State Board
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text-muted)', marginBottom: '16px' }}>
                Focused on Science, Mathematics, and Computer Science.
              </p>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Score: 94%</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.78rem', fontFamily: "'Fira Code', monospace", color: '#8CB414', marginBottom: '8px' }}>
                2017 – 2018
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>Gurudeva Public School, Thrissur</h4>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                10th Grade — CBSE
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text-muted)', marginBottom: '16px' }}>
                Completed 10th Grade CBSE certification with outstanding honors.
              </p>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Score: 93.33%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
