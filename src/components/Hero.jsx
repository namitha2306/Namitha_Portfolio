import React from 'react';
import { ArrowUpRight, MessageSquare, FileText, Eye } from 'lucide-react';

export default function Hero({ onContactClick, onProjectsClick, onResumeClick, onCVClick }) {
  return (
    <div id="hero" className="hero-content">
      <div className="cartooneast-greeting">Hi,</div>
      
      <h1 className="cartooneast-headline">
        <span>I build.</span>
        <span>AI scales.</span>
        <span className="highlight">Simple.</span>
      </h1>

      <div className="cartooneast-meta">
        <div className="cartooneast-name">Namitha M S</div>
        <div className="cartooneast-role">AI/ML Developer &amp; UI/UX Designer</div>
        <p className="cartooneast-desc">
          Integrated MSc Computer Science Candidate at CUSAT (8.44 GPA). 
          Structuring robust mathematical foundations in AI and implementing neural architectures from deepfake detection to multi-agent LLMs.
        </p>
      </div>

      <div className="hero-buttons">
        <button 
          onClick={onProjectsClick} 
          className="btn-primary" 
          data-hover="true"
          id="hero-works-btn"
        >
          <span>Works</span>
          <ArrowUpRight size={18} />
        </button>

        {/* View CV — opens modal directly */}
        <button
          onClick={onCVClick}
          className="btn-primary"
          data-hover="true"
          id="hero-view-cv-btn"
          style={{
            background: 'transparent',
            color: '#F5EDD8',
            border: '1.5px solid #CC2A25',
            boxShadow: '0 4px 16px rgba(204,42,37,0.20)',
          }}
        >
          <Eye size={16} />
          <span>View CV</span>
        </button>

        <button 
          onClick={onContactClick} 
          className="btn-secondary" 
          data-hover="true"
          id="hero-contact-btn"
        >
          <MessageSquare size={16} />
          <span>Let's Talk</span>
        </button>
      </div>
    </div>
  );
}
