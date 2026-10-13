import React from 'react';

export default function Navbar({ activeSection, setActiveSection }) {
  const navItems = [
    { id: 'hero', label: 'HOME' },
    { id: 'projects', label: 'WORKS' },
    { id: 'about', label: 'ABOUT' },
    { id: 'journey', label: 'JOURNEY' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'research', label: 'RESEARCH' },
    { id: 'creative', label: 'CREATIVE' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar-wrapper">
      <nav className="nav-pill" aria-label="Main Navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            data-hover="true"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
