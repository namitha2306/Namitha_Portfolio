import React from 'react';
import { BookOpen, Stethoscope, Globe, Tag } from 'lucide-react';

export default function ResearchSection() {
  const researchItems = [
    {
      title: 'Skin Cancer Detection Using Unsupervised Saliency Detection Techniques',
      subtitle: 'NIT Calicut Research Internship',
      desc: 'Research focused on applying unsupervised saliency detection techniques to dermoscopic images for skin cancer screening. The work explored spectral clustering and saliency-based approaches to improve the isolation of relevant lesion regions and visual features.',
      areas: [
        'Medical Computer Vision',
        'Skin Cancer Detection',
        'Saliency Detection',
        'Image Segmentation',
        'Spectral Clustering',
        'PyTorch'
      ],
      icon: <Stethoscope size={22} />
    },
    {
      title: 'Fake News Detection in Dravidian Languages',
      subtitle: 'Academic Research Study',
      desc: 'Research focused on applying transformer-based NLP models to fake news detection in Malayalam. The project investigated and compared IndicBERT, MuRIL, and multilingual BERT-based approaches for classification of morphologically rich Dravidian-language text.',
      areas: [
        'Natural Language Processing',
        'Multilingual NLP',
        'Malayalam NLP',
        'Transformer Models',
        'Text Classification',
        'Fake News Detection'
      ],
      icon: <Globe size={22} />
    }
  ];

  return (
    <section id="research" className="section-container" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div className="max-w-6xl mx-auto">
        <div style={{ fontSize: '0.85rem', fontFamily: "'Fira Code', monospace", color: '#CC2A25', letterSpacing: '2px', marginBottom: '8px' }}>
          06 // PUBLICATIONS
        </div>
        <h2 className="section-title">RESEARCH</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {researchItems.map((item, idx) => (
            <div key={idx} className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: "'Fira Code', monospace", color: '#8CB414', fontWeight: 600 }}>
                  {item.subtitle}
                </span>
                <BookOpen size={20} style={{ color: '#CC2A25' }} />
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ fontSize: '0.98rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '20px' }}>
                {item.desc}
              </p>

              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff', marginBottom: '10px' }}>Research Areas:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {item.areas.map((area, aIdx) => (
                  <span key={aIdx} style={{ padding: '6px 14px', background: 'rgba(204, 42, 37, 0.10)', borderRadius: '12px', border: '1px solid rgba(204, 42, 37, 0.28)', fontSize: '0.82rem', color: '#CC2A25', fontWeight: 500 }}>
                    {area}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
