import React from 'react';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function JourneySection() {
  const experiences = [
    {
      period: 'May 2025 – Present',
      role: 'AI Engineer Intern',
      company: 'Pixl.AI',
      location: 'Infopark, Kochi',
      desc: 'Worked on AI engineering and computer vision systems, including deepfake detection using Swin Transformer and EfficientNet-B0 architectures.',
      keyAreas: [
        'Deepfake detection',
        'Swin Transformer',
        'EfficientNet-B0',
        'Computer vision',
        'Model evaluation',
        'Inference optimization',
        'AI chatbot testing and evaluation',
        'AI-based document processing'
      ]
    },
    {
      period: 'May 2024 – July 2024',
      role: 'Research Intern',
      company: 'NIT Calicut',
      location: 'Kozhikode, Kerala',
      desc: 'Worked on medical computer vision research focused on skin cancer detection and unsupervised saliency detection.',
      keyAreas: [
        'Developed skin cancer screening pipelines',
        'Worked with dermoscopic images',
        'Implemented unsupervised saliency detection techniques',
        'Explored spectral cluster voting approaches',
        'Worked with PyTorch',
        'Studied lesion boundary and feature isolation'
      ]
    },
    {
      period: 'June 2023 – July 2023',
      role: 'Student Intern',
      company: 'Pix Dynamics',
      location: 'Infopark, Kochi',
      desc: 'Worked on computer vision and document-image processing systems.',
      keyAreas: [
        'Developed autoencoder-based image denoising systems',
        'Worked on signature denoising',
        'Built image-processing pipelines',
        'Used PyTorch',
        'Worked with YOLOv5',
        'Developed datasets and preprocessing pipelines for document images'
      ]
    }
  ];

  return (
    <section id="journey" className="section-container" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div className="max-w-6xl mx-auto">
        <div style={{ fontSize: '0.85rem', fontFamily: "'Fira Code', monospace", color: '#CC2A25', letterSpacing: '2px', marginBottom: '8px' }}>
          03 // EXPERIENCE
        </div>
        <h2 className="section-title">PROFESSIONAL JOURNEY</h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '48px' }}>
          Hands-on industry and research experience across AI engineering, medical computer vision, and document intelligence.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {experiences.map((exp, idx) => (
            <div key={idx} className="card" style={{ padding: '32px' }} data-hover="true">
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.82rem', fontFamily: "'Fira Code', monospace", color: '#8CB414', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} />
                  <span>{exp.period}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} />
                  <span>{exp.location}</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                {exp.role} <span style={{ color: '#CC2A25', fontWeight: 600 }}>— {exp.company}</span>
              </h3>

              <p style={{ fontSize: '0.98rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '20px' }}>
                {exp.desc}
              </p>

              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff', marginBottom: '12px' }}>
                Key Areas & Contributions:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                {exp.keyAreas.map((area, aIdx) => (
                  <div key={aIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={14} style={{ color: '#CC2A25', flexShrink: 0 }} />
                    <span>{area}</span>
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
