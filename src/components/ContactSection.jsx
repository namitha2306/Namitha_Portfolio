import React, { useState } from 'react';
import { Mail, Phone, Linkedin, Github, Send, CheckCircle, MapPin } from 'lucide-react';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="section-container" style={{ paddingBottom: '80px' }}>
      <div className="max-w-6xl mx-auto">
        <div className="section-number">06 // CONTACT</div>
        
        <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.0, marginBottom: '16px' }}>
          You've Reached The End.<br />
          <span style={{ color: 'var(--cyan-accent)' }}>Or The Beginning.</span>
        </h2>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '750px', marginBottom: '48px', lineHeight: 1.6 }}>
          Open to opportunities involving AI engineering, machine learning, computer vision, NLP, LLM applications, full-stack AI systems, and UI/UX design.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          {/* Cartooneast Contact Direct Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                Mail Me
              </div>
              <a href="mailto:msnamitha3@gmail.com" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', textDecoration: 'none' }} data-hover="true">
                msnamitha3@gmail.com
              </a>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                Meet Me In
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={22} style={{ color: 'var(--lime-accent)' }} />
                <span>Kochi, Kerala, India</span>
              </div>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Or Stalk My Profiles
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <a href="https://linkedin.com/in/namitha-m-s-83562227" target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '10px 18px' }} data-hover="true">
                  <Linkedin size={16} />
                  <span>LinkedIn</span>
                </a>
                <a href="https://github.com/namitha2306" target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '10px 18px' }} data-hover="true">
                  <Github size={16} />
                  <span>GitHub</span>
                </a>
                <a href="tel:+917994301606" className="btn-secondary" style={{ padding: '10px 18px' }} data-hover="true">
                  <Phone size={16} />
                  <span>Phone</span>
                </a>
              </div>
            </div>
          </div>

          {/* Message Form */}
          <div className="card" style={{ padding: '36px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <CheckCircle size={54} style={{ color: '#8CB414', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '10px', color: '#ffffff' }}>Message Sent!</h3>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                  Thank you for reaching out, {formData.name}. I will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about your project, idea, or opportunity..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                  data-hover="true"
                >
                  <span>Send Message</span>
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          © {new Date().getFullYear()} Namitha M S. Cartooneast-inspired AI & Design Portfolio.
        </div>
      </div>
    </section>
  );
}
