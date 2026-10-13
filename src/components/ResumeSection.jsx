import React, { useState } from 'react';
import { Flame, Trophy, Award, Target, CheckCircle2, FileText, Eye, Download } from 'lucide-react';
import CVModal from './CVModal';

export default function ResumeSection() {
  const [cvOpen, setCvOpen] = useState(false);

  const drives = [
    {
      title: 'Design Thinking',
      desc: 'I approach technical problems with a design mindset — understanding user needs, identifying friction points, creating wireframes, prototyping ideas, and building responsive digital experiences.'
    },
    {
      title: 'Hackathons',
      desc: 'I enjoy working under tight deadlines and transforming ideas into functional prototypes. I have participated in multiple hackathons and was a First Prize Winner at MACE Hackify.'
    },
    {
      title: 'Creative Storytelling',
      desc: 'I enjoy simplifying complex technical concepts and communicating them through visual design, structured presentations, and clear digital experiences.'
    },
    {
      title: 'Badminton',
      desc: 'Badminton is one of my interests outside technology. It helps me stay active while developing focus, coordination, and quick decision-making.'
    },
    {
      title: 'Emerging AI',
      desc: 'I actively explore developments in: Generative AI, LLMs, AI Agents, Multi-Agent Systems, RAG, Vector Databases, Cross-Lingual Embeddings, Modern AI Frameworks.'
    }
  ];

  const achievements = [
    {
      title: 'First Prize — MACE Hackify',
      desc: 'Winner of the Hackify hackathon organized by Mar Athanasius College of Engineering.'
    },
    {
      title: 'Industry & Research Experience',
      desc: 'Experience across three organizations: Pixl.AI, NIT Calicut, Pix Dynamics.'
    },
    {
      title: 'AI Projects Portfolio',
      desc: 'Developed projects across Deepfake detection, Medical AI, NLP, Document intelligence, OCR, LLM applications, Multi-agent systems, Full-stack applications.'
    },
    {
      title: 'Certifications',
      desc: 'Completed professional certifications and learning programs through platforms including IBM SkillsBuild, NPTEL / IITs.'
    }
  ];

  const professionalInterests = [
    'AI Engineering',
    'Machine Learning Engineering',
    'Computer Vision',
    'NLP',
    'Generative AI',
    'LLM Applications',
    'AI Agents',
    'Document AI',
    'OCR',
    'Full-Stack AI Applications',
    'AI Research',
    'UI/UX Design'
  ];

  return (
    <>
      <CVModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />

      <section id="resume" className="section-container" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="max-w-6xl mx-auto">

          {/* ── CV HERO BANNER ────────────────────────────── */}
          <div style={{
            marginBottom: '80px',
            padding: '48px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(204,42,37,0.12) 0%, rgba(140,180,20,0.06) 50%, rgba(245,237,216,0.04) 100%)',
            border: '1px solid rgba(204,42,37,0.28)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative glow */}
            <div style={{
              position: 'absolute', top: '-60px', right: '-60px',
              width: '260px', height: '260px',
              background: 'radial-gradient(circle, rgba(204,42,37,0.18) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: '-40px', left: '20%',
              width: '180px', height: '180px',
              background: 'radial-gradient(circle, rgba(140,180,20,0.12) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontFamily: "'Fira Code', monospace", color: '#CC2A25', letterSpacing: '2px', marginBottom: '8px' }}>
                07 // CURRICULUM VITAE
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 800,
                color: 'var(--cream)',
                marginBottom: '12px',
                letterSpacing: '-1px',
              }}>
                My CV
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: 1.6, marginBottom: '32px' }}>
                View and download my full curriculum vitae. Individual pages available as separate PDF downloads.
              </p>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
                {/* View CV */}
                <button
                  id="view-cv-btn"
                  onClick={() => setCvOpen(true)}
                  data-hover="true"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 28px',
                    background: '#CC2A25',
                    color: '#F5EDD8',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    borderRadius: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 6px 24px rgba(204,42,37,0.40)',
                    transition: 'all .3s cubic-bezier(.16,1,.3,1)',
                  }}
                >
                  <Eye size={18} />
                  View CV
                </button>

                {/* Quick download page 1 */}
                <button
                  id="download-cv-p1-btn"
                  onClick={() => { setCvOpen(true); }}
                  data-hover="true"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 22px',
                    background: 'rgba(204,42,37,0.10)',
                    color: '#CC2A25',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    borderRadius: '14px',
                    border: '1px solid rgba(204,42,37,0.40)',
                    cursor: 'pointer',
                    transition: 'all .3s ease',
                  }}
                >
                  <Download size={16} />
                  Download CV
                </button>

                {/* 2-page indicator pills */}
                <div style={{ display: 'flex', gap: '8px', marginLeft: '4px' }}>
                  {[1, 2].map(p => (
                    <div key={p} style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      background: 'rgba(245,237,216,0.06)',
                      border: '1px solid rgba(245,237,216,0.12)',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-code)',
                      color: 'var(--text-muted)',
                    }}>
                      pg {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BEYOND TECHNOLOGY */}
          <div style={{ marginBottom: '60px' }}>
            <div style={{ fontSize: '0.85rem', fontFamily: "'Fira Code', monospace", color: '#CC2A25', letterSpacing: '2px', marginBottom: '8px' }}>
              08 // PERSPECTIVE
            </div>
            <h2 className="section-title">BEYOND TECHNOLOGY</h2>
            <div className="cards-grid">
              {drives.map((d, i) => (
                <div key={i} className="card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                    <Flame size={18} style={{ color: '#CC2A25' }} />
                    <span>{d.title}</span>
                  </h3>
                  <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ACHIEVEMENTS */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '60px', marginBottom: '60px' }}>
            <div style={{ fontSize: '0.85rem', fontFamily: "'Fira Code', monospace", color: '#CC2A25', letterSpacing: '2px', marginBottom: '8px' }}>
              09 // MILESTONES
            </div>
            <h2 className="section-title">ACHIEVEMENTS</h2>
            <div className="cards-grid">
              {achievements.map((item, idx) => (
                <div key={idx} className="card" style={{ padding: '28px' }}>
                  <Trophy size={24} style={{ color: '#8CB414', marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CURRENT PROFESSIONAL INTERESTS */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '60px' }}>
            <div style={{ fontSize: '0.85rem', fontFamily: "'Fira Code', monospace", color: '#CC2A25', letterSpacing: '2px', marginBottom: '8px' }}>
              10 // FOCUS
            </div>
            <h2 className="section-title">CURRENT PROFESSIONAL INTERESTS</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              I am actively interested in opportunities involving:
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {professionalInterests.map((interest, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'rgba(204, 42, 37, 0.09)', borderRadius: '14px', border: '1px solid rgba(204, 42, 37, 0.28)', fontSize: '0.9rem', color: 'var(--cream)', fontWeight: 600 }}>
                  <Target size={16} style={{ color: '#CC2A25' }} />
                  <span>{interest}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
