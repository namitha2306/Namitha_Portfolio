import React, { useState } from 'react';
import Cursor from './components/Cursor';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import CharacterCanvas from './components/CharacterCanvas';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import JourneySection from './components/JourneySection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ResearchSection from './components/ResearchSection';
import CreativeSection from './components/CreativeSection';
import ResumeSection from './components/ResumeSection';
import ContactSection from './components/ContactSection';
import CVModal from './components/CVModal';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [cvOpen, setCvOpen] = useState(false);

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="portfolio-app">
      {/* Custom Magnetic Cursor */}
      <Cursor />

      {/* CV Modal — globally available */}
      <CVModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />

      {/* Modern Fully Animated Ambient Dark Background */}
      <AnimatedBackground />

      {/* Floating Frosted Glass Navbar */}
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Floating CV Quick-Access Button */}
      <button
        id="floating-cv-btn"
        onClick={() => setCvOpen(true)}
        data-hover="true"
        title="View CV"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          background: '#CC2A25',
          color: '#F5EDD8',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.85rem',
          borderRadius: '50px',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 28px rgba(204,42,37,0.45)',
          transition: 'all .3s cubic-bezier(.16,1,.3,1)',
        }}
      >
        {/* File icon SVG */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        CV
      </button>

      {/* Hero Section with 3D Sphere Canvas */}
      <main className="hero-container">
        <CharacterCanvas />
        <Hero
          onContactClick={() => scrollTo('contact')}
          onProjectsClick={() => scrollTo('projects')}
          onResumeClick={() => scrollTo('resume')}
          onCVClick={() => setCvOpen(true)}
        />
      </main>

      {/* Complete Portfolio Sections */}
      <AboutSection />
      <JourneySection />
      <SkillsSection />
      <ProjectsSection />
      <ResearchSection />
      <CreativeSection />
      <ResumeSection />
      <ContactSection />
    </div>
  );
}
