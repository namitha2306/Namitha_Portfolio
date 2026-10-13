import React from 'react';
import { Palette, CheckCircle2 } from 'lucide-react';

export default function CreativeSection() {
  const creativeWork = [
    {
      title: 'TEDxCUSAT — Website & Brand System',
      desc: 'Worked on UI design and promotional assets for TEDxCUSAT. Focused on maintaining a consistent visual language across digital and promotional materials.',
      created: [
        'Website UI',
        'Event interfaces',
        'Promotional graphics',
        'Background banners',
        'Speaker layouts',
        'Event branding assets'
      ]
    },
    {
      title: 'Hackify — UI/UX & Branding',
      desc: 'Designed visual assets and UI elements for MACE Hackify.',
      created: [
        'Vector assets',
        'Marketing graphics',
        'Layout systems',
        'Digital promotional material',
        'Illustrations'
      ]
    },
    {
      title: 'Freelance Corporate Design',
      desc: 'Created branding and visual systems for emerging businesses and organizations.',
      created: [
        'Branding templates',
        'Typography systems',
        'Color guides',
        'Social media graphics',
        'Vector illustrations',
        'Corporate design assets',
        'Promotional material'
      ]
    }
  ];

  return (
    <section id="creative" className="section-container" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div className="max-w-6xl mx-auto">
        <div style={{ fontSize: '0.85rem', fontFamily: "'Fira Code', monospace", color: '#CC2A25', letterSpacing: '2px', marginBottom: '8px' }}>
          07 // VISUALS
        </div>
        <h2 className="section-title">DESIGN & CREATIVE WORK</h2>

        <div className="cards-grid">
          {creativeWork.map((item, idx) => (
            <div key={idx} className="card" data-hover="true">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.78rem', fontFamily: "'Fira Code', monospace", color: '#8CB414', fontWeight: 600 }}>
                  0{idx + 1} // CREATIVE
                </span>
                <Palette size={20} style={{ color: '#CC2A25' }} />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ fontSize: '0.94rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '20px' }}>
                {item.desc}
              </p>

              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#ffffff', marginBottom: '10px' }}>Assets Created:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {item.created.map((c, cIdx) => (
                  <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={14} style={{ color: '#8CB414', flexShrink: 0 }} />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
