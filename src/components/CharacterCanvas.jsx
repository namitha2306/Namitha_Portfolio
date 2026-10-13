import React, { useEffect, useRef } from 'react';

export default function CharacterCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h, animId;
    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;
    let rotX = 0, rotY = 0;
    let time = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      mouseX = w / 2;
      mouseY = h / 2;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Color palette (Pantone)
    const CREAM  = { r: 245, g: 237, b: 216 };
    const RED    = { r: 204, g: 42,  b: 37  };
    const GREEN  = { r: 140, g: 180, b: 20  };

    const lerpColor = (a, b, t) => ({
      r: a.r + (b.r - a.r) * t,
      g: a.g + (b.g - a.g) * t,
      b: a.b + (b.b - a.b) * t,
    });
    const rgba = (c, a) => `rgba(${c.r|0},${c.g|0},${c.b|0},${a})`;

    // 3-D rotation helpers
    const rotatePoint = (x, y, z, rx, ry) => {
      // Rotate around Y axis
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      let x1 = x * cosY - z * sinY;
      let z1 = x * sinY + z * cosY;
      // Rotate around X axis
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      let y1 = y * cosX - z1 * sinX;
      let z2 = y * sinX + z1 * cosX;
      return { x: x1, y: y1, z: z2 };
    };

    const project = (x, y, z, cx, cy, fov = 500) => {
      const scale = fov / (fov + z);
      return { x: cx + x * scale, y: cy + y * scale, scale };
    };

    // Generate sphere points
    const NUM_LAT = 18, NUM_LON = 36;
    const RADIUS = 160;
    const spherePoints = [];
    for (let lat = 0; lat <= NUM_LAT; lat++) {
      for (let lon = 0; lon <= NUM_LON; lon++) {
        const phi   = (lat / NUM_LAT) * Math.PI;
        const theta = (lon / NUM_LON) * 2 * Math.PI;
        spherePoints.push({
          x: RADIUS * Math.sin(phi) * Math.cos(theta),
          y: RADIUS * Math.cos(phi),
          z: RADIUS * Math.sin(phi) * Math.sin(theta),
          lat, lon,
        });
      }
    }

    // Orbiting rings config
    const rings = [
      { tiltX: 0.4,  tiltZ: 0.2,  radius: 240, speed: 0.6,  width: 2,  color: RED,   alpha: 0.7 },
      { tiltX: -0.5, tiltZ: 0.8,  radius: 200, speed: -0.4, width: 1.5, color: GREEN, alpha: 0.6 },
      { tiltX: 1.1,  tiltZ: -0.3, radius: 270, speed: 0.25, width: 1,  color: CREAM,  alpha: 0.35 },
    ];

    const drawRing = (cx, cy, ring, rx, ry) => {
      const STEPS = 120;
      const pts = [];
      for (let i = 0; i <= STEPS; i++) {
        const a = (i / STEPS) * 2 * Math.PI;
        let px = ring.radius * Math.cos(a);
        let pz = ring.radius * Math.sin(a);
        let py = 0;

        // Apply tilt
        const cy2 = py * Math.cos(ring.tiltX) - pz * Math.sin(ring.tiltX);
        const cz2 = py * Math.sin(ring.tiltX) + pz * Math.cos(ring.tiltX);
        const cx2 = px * Math.cos(ring.tiltZ) + cy2 * Math.sin(ring.tiltZ);
        const cy3 = -px * Math.sin(ring.tiltZ) + cy2 * Math.cos(ring.tiltZ);
        px = cx2; py = cy3; pz = cz2;

        const rot = rotatePoint(px, py, pz, rx, ry);
        const p = project(rot.x, rot.y, rot.z, cx, cy);
        pts.push({ ...p, z: rot.z });
      }

      ctx.beginPath();
      pts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.strokeStyle = rgba(ring.color, ring.alpha);
      ctx.lineWidth = ring.width;
      ctx.stroke();
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      time += 0.008;

      const isMobile = w < 868;
      const cx = isMobile ? w / 2 : w * 0.72;
      const cy = h / 2;

      // Mouse-driven rotation target
      targetRotY = ((mouseX - w / 2) / w) * 0.6;
      targetRotX = ((mouseY - h / 2) / h) * 0.4;
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      const rx = rotX + Math.sin(time * 0.3) * 0.08;
      const ry = rotY + time * 0.15;

      // === Outer ambient glow ===
      const glowR = RADIUS + 80 + Math.sin(time * 1.2) * 20;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      glow.addColorStop(0,   rgba(RED, 0.12));
      glow.addColorStop(0.45, rgba(GREEN, 0.06));
      glow.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(cx - glowR, cy - glowR, glowR * 2, glowR * 2);

      // === Rings (back) ===
      rings.forEach((ring, ri) => {
        ring.tiltX += ring.speed * 0.008;
        drawRing(cx, cy, ring, rx, ry);
      });

      // === Sphere dots ===
      const sorted = spherePoints.map(pt => {
        const rotated = rotatePoint(pt.x, pt.y, pt.z, rx, ry);
        const morphOffset = Math.sin(time * 1.5 + pt.lat * 0.4) * 10 + Math.cos(time * 0.8 + pt.lon * 0.3) * 8;
        const scale = (RADIUS + morphOffset) / RADIUS;
        const pr = project(rotated.x * scale, rotated.y * scale, rotated.z * scale, cx, cy);
        const visibility = (rotated.z + RADIUS) / (2 * RADIUS); // 0 (back) → 1 (front)
        return { ...pr, visibility, lat: pt.lat, lon: pt.lon };
      });
      sorted.sort((a, b) => a.z - b.z);

      sorted.forEach(pt => {
        const v = pt.visibility;
        const c = lerpColor(GREEN, RED, v);
        const dotSize = 1.2 + v * 1.6;
        const alpha = 0.15 + v * 0.75;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, dotSize * pt.scale, 0, Math.PI * 2);
        ctx.fillStyle = rgba(c, alpha);
        ctx.fill();
      });

      // === Central sphere core glow ===
      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, RADIUS * 0.9);
      coreGlow.addColorStop(0,   rgba(CREAM, 0.06));
      coreGlow.addColorStop(0.5, rgba(RED, 0.04));
      coreGlow.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, RADIUS * 0.9, 0, Math.PI * 2);
      ctx.fill();

      // === Equator ring highlight ===
      const eqProgress = (Math.sin(time * 0.7) + 1) / 2;
      const eqColor = lerpColor(RED, GREEN, eqProgress);
      ctx.beginPath();
      ctx.ellipse(cx, cy, RADIUS + 10, (RADIUS + 10) * Math.abs(Math.sin(rx + 0.3)) * 0.25 + 8, ry, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(eqColor, 0.4 + eqProgress * 0.3);
      ctx.lineWidth = 2;
      ctx.stroke();

      // === Floating particles around sphere ===
      for (let i = 0; i < 12; i++) {
        const angle = time * 0.4 + (i / 12) * Math.PI * 2;
        const dist  = RADIUS + 40 + Math.sin(time + i * 0.8) * 25;
        const pz    = Math.sin(time * 0.5 + i) * 60;
        const px    = dist * Math.cos(angle);
        const py    = dist * Math.sin(angle) * 0.35;
        const rot = rotatePoint(px, py, pz, rx, ry);
        const pp  = project(rot.x, rot.y, rot.z, cx, cy);
        const vis = (rot.z + RADIUS * 2) / (RADIUS * 4);
        const pc = i % 3 === 0 ? RED : i % 3 === 1 ? GREEN : CREAM;
        ctx.beginPath();
        ctx.arc(pp.x, pp.y, (1.5 + Math.sin(time * 2 + i) * 0.8) * pp.scale, 0, Math.PI * 2);
        ctx.fillStyle = rgba(pc, 0.6 * vis);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="character-canvas"
      aria-label="Interactive 3D morphing sphere visualization"
    />
  );
}
