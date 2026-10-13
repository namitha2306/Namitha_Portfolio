import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Pantone palette particles
    const COLORS = [
      'rgba(204, 42, 37, ',    // Red
      'rgba(140, 180, 20, ',   // Green
      'rgba(245, 237, 216, ',  // Cream
    ];

    const particleCount = Math.min(55, Math.floor(window.innerWidth / 26));
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        radius: Math.random() * 1.8 + 0.8,
        color: COLORS[i % 3],
      });
    }

    let mouseX = w / 2;
    let mouseY = h / 2;
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animId = null;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '0.55)';
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 125) {
            const alpha = (1 - dist / 125) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(204, 42, 37, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        // Mouse interaction line
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < 150) {
          const mAlpha = (1 - mDist / 150) * 0.30;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(140, 180, 20, ${mAlpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="bg-anim-container">
      {/* Pantone ambient orbs */}
      <div className="gradient-orb orb-1" />
      <div className="gradient-orb orb-2" />
      <div className="gradient-orb orb-3" />
      <canvas ref={canvasRef} className="particle-canvas" />
    </div>
  );
}
