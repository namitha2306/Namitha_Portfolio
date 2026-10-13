import React, { useState } from 'react';
import { Cpu, Bot, Code2, Database, Palette } from 'lucide-react';

export default function SkillsSection() {
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { id: 'all', label: 'All Ecosystems' },
    { id: 'aiml', label: 'AI & Machine Learning' },
    { id: 'llm', label: 'LLM & AI Engineering' },
    { id: 'dev', label: 'Programming & Dev' },
    { id: 'data', label: 'Data & Analytics' },
    { id: 'design', label: 'Design' }
  ];

  const skillGroups = [
    {
      cat: 'aiml',
      title: 'AI & Machine Learning',
      icon: <Cpu size={20} />,
      items: [
        'Python', 'PyTorch', 'TensorFlow', 'Hugging Face Transformers', 
        'Machine Learning', 'Deep Learning', 'Natural Language Processing', 
        'Computer Vision', 'Swin Transformer', 'EfficientNet', 'Autoencoders', 
        'YOLOv5', 'Multi-Agent AI Systems'
      ]
    },
    {
      cat: 'llm',
      title: 'LLM & AI Engineering',
      icon: <Bot size={20} />,
      items: [
        'LLM Applications', 'Prompt Engineering', 'Qwen', 'LoRA Fine-Tuning', 
        'LangGraph', 'LangChain', 'RAG', 'AI Agents', 'Model Evaluation', 'Document Intelligence'
      ]
    },
    {
      cat: 'dev',
      title: 'Programming & Development',
      icon: <Code2 size={20} />,
      items: [
        'Python', 'C++', 'R', 'MATLAB', 'JavaScript', 'HTML', 'CSS', 
        'React.js', 'Node.js', 'FastAPI', 'Flask'
      ]
    },
    {
      cat: 'data',
      title: 'Data & Analytics',
      icon: <Database size={20} />,
      items: ['SQL', 'MongoDB', 'Power BI', 'Tableau']
    },
    {
      cat: 'design',
      title: 'Design',
      icon: <Palette size={20} />,
      items: [
        'Figma', 'Canva', 'UI/UX Design', 'Visual Design', 
        'Graphic Design', 'Event Branding', 'Digital Marketing Assets'
      ]
    }
  ];

  const filteredGroups = activeTab === 'all' 
    ? skillGroups 
    : skillGroups.filter(g => g.cat === activeTab);

  return (
    <section id="skills" className="section-container" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div className="max-w-6xl mx-auto">
        <div style={{ fontSize: '0.85rem', fontFamily: "'Fira Code', monospace", color: '#CC2A25', letterSpacing: '2px', marginBottom: '8px' }}>
          04 // CAPABILITIES
        </div>
        <h2 className="section-title">TECHNICAL SKILLS</h2>

        {/* Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className="btn-secondary"
              style={{
                padding: '8px 18px',
                fontSize: '0.82rem',
                backgroundColor: activeTab === cat.id ? '#CC2A25' : 'rgba(30, 24, 18, 0.6)',
                color: activeTab === cat.id ? '#F5EDD8' : 'var(--text-secondary)',
                borderColor: activeTab === cat.id ? '#CC2A25' : 'rgba(245, 237, 216, 0.15)'
              }}
              data-hover="true"
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="cards-grid">
          {filteredGroups.map((group, idx) => (
            <div key={idx} className="card" data-hover="true">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ padding: '8px', background: 'rgba(204, 42, 37, 0.14)', borderRadius: '10px', color: '#CC2A25' }}>
                  {group.icon}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>{group.title}</h3>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {group.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.07)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      fontSize: '0.84rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {item}
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
