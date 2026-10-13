import React, { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const auraRef = useRef(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let auraX = mouseX;
    let auraY = mouseY;
    let isVisible = true;
    let animFrameId = null;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (auraRef.current) auraRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (auraRef.current) auraRef.current.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isVisible = true;
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (auraRef.current) auraRef.current.style.opacity = '1';
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.nav-item') ||
        target.closest('.card') ||
        target.hasAttribute('data-hover')
      ) {
        document.body.classList.add('hovered');
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.nav-item') ||
        target.closest('.card') ||
        target.hasAttribute('data-hover')
      ) {
        document.body.classList.remove('hovered');
      }
    };

    const render = () => {
      // Fast lerp for dot, smooth lerp for aura
      dotX += (mouseX - dotX) * 0.75;
      dotY += (mouseY - dotY) * 0.75;
      auraX += (mouseX - auraX) * 0.22;
      auraY += (mouseY - auraY) * 0.22;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }
      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) translate(-50%, -50%)`;
      }

      animFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={auraRef} className="cursor-aura" />
    </>
  );
}

