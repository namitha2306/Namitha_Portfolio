import React, { useState } from 'react';
import { ArrowRight, ShieldAlert, FileSearch, Globe, Bot, Stethoscope, ShoppingBag, Trophy } from 'lucide-react';

export default function ProjectsSection() {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  const projects = [
    {
      id: 'hyperswin',
      num: '1',
      title: 'Deepfake Detection with HyperSwin',
      tech: 'Swin Transformer, EfficientNet-B0, PyTorch, RetinaFace',
      desc: 'A deepfake detection system combining Swin Transformer and EfficientNet-B0 architectures for image and video classification. The system uses RetinaFace for face detection and frame sampling and is designed with inference efficiency in mind.',
      focus: [
        'Deepfake detection',
        'Computer vision',
        'Transformer architectures',
        'CNN-based feature extraction',
        'Face detection',
        'Real-time inference optimization'
      ],
      icon: <ShieldAlert size={22} />
    },
    {
      id: 'passport',
      num: '2',
      title: 'Passport Information Extraction API',
      tech: 'Qwen 2.5, LoRA, PaddleOCR, FastAPI',
      desc: 'An end-to-end document intelligence system that processes passport images and converts extracted information into structured JSON. The system combines OCR with a fine-tuned Qwen 2.5 model to interpret and structure passport information.',
      focus: [
        'OCR',
        'Document AI',
        'Qwen 2.5',
        'LoRA fine-tuning',
        'Information extraction',
        'Structured JSON generation',
        'FastAPI'
      ],
      icon: <FileSearch size={22} />
    },
    {
      id: 'fakenews',
      num: '3',
      title: 'Fake News Detection in Dravidian Languages',
      tech: 'IndicBERT, MuRIL, mBERT, Transformers',
      desc: 'A multilingual NLP project focused on detecting fake news in Malayalam. The project evaluates transformer-based language models including IndicBERT, MuRIL, and mBERT for classification of Malayalam text.',
      result: 'MuRIL achieved 87.53% accuracy in evaluation.',
      focus: [
        'NLP',
        'Multilingual NLP',
        'Malayalam language processing',
        'Transformer models',
        'Text classification',
        'Fake news detection'
      ],
      icon: <Globe size={22} />
    },
    {
      id: 'civicflow',
      num: '4',
      title: 'CivicFlow.AI — Multi-Agent Citizen Helpdesk',
      tech: 'LangGraph, Gemini, Streamlit, SerpAPI',
      desc: 'A multi-agent AI system designed to help users find and understand government-related information. The system uses separate agents for information retrieval, summarization, validation, and review.',
      focus: [
        'Research/Search Agent',
        'Summarization Agent',
        'Validation Agent',
        'Review Agent',
        'LangGraph orchestration',
        'Gemini',
        'Streamlit'
      ],
      icon: <Bot size={22} />
    },
    {
      id: 'medtech',
      num: '5',
      title: 'MedTech — Automated Medical Assistant',
      tech: 'YOLOv5, PyTorch, Flask',
      desc: 'An AI-based medical assistance system developed to analyze medical images and assist with the identification of different conditions. Explored skin anomaly detection, bone fracture detection, and pneumonia detection.',
      badge: 'First Prize Winner — MACE Hackify',
      focus: [
        'Skin anomaly detection',
        'Bone fracture detection',
        'Pneumonia detection',
        'Computer vision',
        'YOLOv5',
        'PyTorch',
        'Flask'
      ],
      icon: <Stethoscope size={22} />
    },
    {
      id: 'ebuy',
      num: '6',
      title: 'EBUY — Online Flea Market Platform',
      tech: 'React/Node.js, MongoDB, HTML, CSS, JavaScript',
      desc: 'A responsive online marketplace designed for buying and selling second-hand products. Features user authentication, product listing, dynamic item management, and MongoDB-based data management.',
      focus: [
        'User authentication',
        'Product listing',
        'Dynamic item management',
        'Marketplace interface',
        'MongoDB-based data management',
        'Responsive UI'
      ],
      icon: <ShoppingBag size={22} />
    }
  ];

  return (
    <section id="projects" className="section-container" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div className="max-w-6xl mx-auto">
        <div style={{ fontSize: '0.85rem', fontFamily: "'Fira Code', monospace", color: '#CC2A25', letterSpacing: '2px', marginBottom: '8px' }}>
          05 // PROJECTS
        </div>
        <h2 className="section-title">FEATURED PROJECTS</h2>

        <div className="cards-grid">
          {projects.map((proj) => (
            <div key={proj.id} className="card" data-hover="true">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.78rem', fontFamily: "'Fira Code', monospace", color: '#8CB414', fontWeight: 600 }}>
                  0{proj.num} // PROJECT
                </span>
                <div style={{ padding: '6px', background: 'rgba(204, 42, 37, 0.14)', borderRadius: '8px', color: '#CC2A25' }}>
                  {proj.icon}
                </div>
              </div>

              {proj.badge && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(140, 180, 20, 0.15)', borderRadius: '12px', color: '#8CB414', fontSize: '0.75rem', fontWeight: 700, marginBottom: '10px' }}>
                  <Trophy size={12} />
                  <span>{proj.badge}</span>
                </div>
              )}

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>{proj.title}</h3>

              <div style={{ fontSize: '0.82rem', fontFamily: "'Fira Code', monospace", color: '#CC2A25', marginBottom: '12px' }}>
                {proj.tech}
              </div>

              <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '20px' }}>
                {proj.desc}
              </p>

              {proj.result && (
                <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(204, 42, 37, 0.08)', border: '1px solid rgba(204, 42, 37, 0.25)', fontSize: '0.84rem', fontWeight: 600, color: '#CC2A25', marginBottom: '16px' }}>
                  ★ Reported Result: {proj.result}
                </div>
              )}

              <button
                onClick={() => setSelectedCaseStudy(selectedCaseStudy === proj.id ? null : proj.id)}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem', padding: '10px 16px' }}
                data-hover="true"
              >
                <span>{selectedCaseStudy === proj.id ? 'Close Details' : 'Focus Areas & Breakdown'}</span>
                <ArrowRight size={14} />
              </button>

              {selectedCaseStudy === proj.id && (
                <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff', marginBottom: '10px' }}>Focus Areas:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {proj.focus.map((area, aIdx) => (
                      <span key={aIdx} style={{ padding: '4px 10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        • {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
