import React from 'react';
import { ExternalLink, Github, Code, Sparkles, Layers, Cpu } from 'lucide-react';

export default function WorkSection() {
  const projects = [
    {
      title: 'Aura Spatial Engine',
      category: 'Web Graphics & Canvas',
      description: 'A 60 FPS real-time interactive canvas renderer with sub-millisecond cursor tracking and zero-lag frame interpolation.',
      tags: ['React', 'HTML5 Canvas', 'OpenCV', 'WebP'],
      icon: <Sparkles size={24} className="text-white" />
    },
    {
      title: 'Nexus Cloud Matrix',
      category: 'Full Stack Platform',
      description: 'Enterprise-grade microservice orchestrator featuring real-time telemetry streaming and distributed state synchronization.',
      tags: ['Node.js', 'TypeScript', 'WebSockets', 'Redis'],
      icon: <Layers size={24} className="text-white" />
    },
    {
      title: 'Vortex Neural Analytics',
      category: 'AI Dashboard',
      description: 'High-throughput real-time AI metrics dashboard with dynamic WebGL visualizations and responsive micro-interactions.',
      tags: ['Next.js', 'Three.js', 'Tailwind', 'Python'],
      icon: <Cpu size={24} className="text-white" />
    }
  ];

  return (
    <section id="work" className="section-container">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">Selected Work</h2>
        <div className="cards-grid">
          {projects.map((proj, idx) => (
            <div key={idx} className="card" data-hover="true">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>
                  {proj.category}
                </span>
                {proj.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>{proj.title}</h3>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6, opacity: 0.85, marginBottom: '20px' }}>
                {proj.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {proj.tags.map((tag, tIdx) => (
                  <span key={tIdx} style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    fontSize: '0.78rem',
                    fontWeight: 600
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  <span>Live Preview</span>
                  <ExternalLink size={14} />
                </button>
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  opacity: 0.8,
                  cursor: 'pointer'
                }}>
                  <span>Source</span>
                  <Github size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
