"use client";

import { useEffect, useRef } from "react";

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const bgCanvas = canvasRef.current;
    if (!bgCanvas) return;

    const bgCtx = bgCanvas.getContext('2d', { alpha: false });
    if (!bgCtx) return;

    let width: number, height: number;
    let animationFrameId: number;

    function resize() {
      if (!bgCanvas) return;
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const isMobile = () => width <= 768;

    // --- Layer 1: Orbs ---
    const orbs = [
        { x: 0.2, y: 0.3, color: '#378ADD', size: 0.4, phase: 0, speed: 0.0005, dx: 0.0002, dy: 0.0001 },
        { x: 0.8, y: 0.7, color: '#534AB7', size: 0.5, phase: Math.PI, speed: 0.0004, dx: -0.0001, dy: -0.0002 },
        { x: 0.5, y: 0.8, color: '#1D9E75', size: 0.45, phase: Math.PI/2, speed: 0.0006, dx: 0.00015, dy: -0.00015 }
    ];

    function drawOrbs(t: number) {
        if (!bgCtx) return;
        orbs.forEach(orb => {
            orb.x += orb.dx;
            orb.y += orb.dy;
            if (orb.x < 0 || orb.x > 1) orb.dx *= -1;
            if (orb.y < 0 || orb.y > 1) orb.dy *= -1;

            const cx = orb.x * width;
            const cy = orb.y * height;
            // Breathing scale
            const scale = 1 + Math.sin(t * orb.speed + orb.phase) * 0.2;
            const radius = orb.size * Math.max(width, height) * scale;

            const gradient = bgCtx.createRadialGradient(cx, cy, 0, cx, cy, radius);
            gradient.addColorStop(0, orb.color + '20'); // roughly 12% opacity (hex 20 = 32/255)
            gradient.addColorStop(1, 'rgba(19, 19, 19, 0)'); // fade to bg

            bgCtx.fillStyle = gradient;
            bgCtx.beginPath();
            bgCtx.arc(cx, cy, radius, 0, Math.PI * 2);
            bgCtx.fill();
        });
    }

    // --- Layer 2: Neural Network ---
    const keywords = ["Python", "SQL", "Leadership", "ML", "AWS", "Product", "Strategy", "Agile", "UI/UX", "Data", "React", "Cloud"];
    const nodes: any[] = [];
    const numNodes = 14;
    const connections: any[] = [];
    const pulses: any[] = [];

    // Init nodes
    for (let i = 0; i < numNodes; i++) {
        nodes.push({
            x: (Math.random() - 0.5) * 2, // normalized coordinates relative to center
            y: (Math.random() - 0.5) * 2,
            z: (Math.random() - 0.5) * 2,
            word: i < keywords.length ? keywords[i] : ''
        });
    }

    // Init connections (connect nearby nodes)
    for(let i=0; i<nodes.length; i++) {
        for(let j=i+1; j<nodes.length; j++) {
            if(Math.random() > 0.5) { // 50% chance to connect
                connections.push({a: i, b: j});
            }
        }
    }

    // Generate a new pulse occasionally
    function spawnPulse() {
        if(connections.length === 0) return;
        const conn = connections[Math.floor(Math.random() * connections.length)];
        pulses.push({
            conn: conn,
            progress: 0,
            speed: 0.005 + Math.random() * 0.005, // slow pulse
            dir: Math.random() > 0.5 ? 1 : -1
        });
    }
    const pulseInterval = setInterval(spawnPulse, 3500); // Pulse every 3-4s

    function drawNetwork(t: number) {
        if (isMobile() || !bgCtx) return; // Skip complex render on mobile

        bgCtx.save();
        bgCtx.translate(width/2, height/2);
        
        // Slow rotation
        const rotX = t * 0.0001;
        const rotY = t * 0.00015;
        
        const projectedNodes = nodes.map(node => {
            // Rotate
            let x1 = node.x * Math.cos(rotY) - node.z * Math.sin(rotY);
            let z1 = node.x * Math.sin(rotY) + node.z * Math.cos(rotY);
            
            let y2 = node.y * Math.cos(rotX) - z1 * Math.sin(rotX);
            let z2 = node.y * Math.sin(rotX) + z1 * Math.cos(rotX);
            
            // Project (simple orthographicish for network scale)
            const scale = width * 0.4;
            return {
                x: x1 * scale,
                y: y2 * scale,
                z: z2,
                word: node.word
            };
        });

        // Draw lines
        bgCtx.lineWidth = 1;
        bgCtx.strokeStyle = 'rgba(161, 201, 255, 0.18)'; // 18% opacity blue
        
        connections.forEach(conn => {
            const p1 = projectedNodes[conn.a];
            const p2 = projectedNodes[conn.b];
            bgCtx.beginPath();
            bgCtx.moveTo(p1.x, p1.y);
            bgCtx.lineTo(p2.x, p2.y);
            bgCtx.stroke();
        });

        // Draw pulses
        pulses.forEach((pulse, index) => {
            pulse.progress += pulse.speed;
            if(pulse.progress >= 1) {
                pulses.splice(index, 1);
                return;
            }
            
            const p1 = projectedNodes[pulse.dir === 1 ? pulse.conn.a : pulse.conn.b];
            const p2 = projectedNodes[pulse.dir === 1 ? pulse.conn.b : pulse.conn.a];
            
            const px = p1.x + (p2.x - p1.x) * pulse.progress;
            const py = p1.y + (p2.y - p1.y) * pulse.progress;
            
            bgCtx.fillStyle = '#a1c9ff';
            bgCtx.shadowBlur = 10;
            bgCtx.shadowColor = '#a1c9ff';
            bgCtx.beginPath();
            bgCtx.arc(px, py, 2, 0, Math.PI*2);
            bgCtx.fill();
            bgCtx.shadowBlur = 0;
        });

        // Draw nodes/text
        bgCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        bgCtx.font = "12px 'JetBrains Mono', monospace";
        bgCtx.textAlign = "center";
        bgCtx.textBaseline = "middle";

        projectedNodes.forEach(p => {
            bgCtx.beginPath();
            bgCtx.arc(p.x, p.y, 2, 0, Math.PI*2);
            bgCtx.fill();
            
            if(p.word) {
                // Fade text based on z-depth
                const alpha = Math.max(0.05, 0.3 - (p.z * 0.1));
                bgCtx.fillStyle = `rgba(161, 201, 255, ${alpha})`;
                bgCtx.fillText(p.word, p.x, p.y - 12);
                bgCtx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // reset
            }
        });

        bgCtx.restore();
    }

    function animateBg(t: number) {
        if (!bgCtx) return;
        // Clear with base color
        bgCtx.fillStyle = '#131313'; // Theme background
        bgCtx.fillRect(0, 0, width, height);

        drawOrbs(t);
        drawNetwork(t);

        animationFrameId = requestAnimationFrame(animateBg);
    }
    
    animationFrameId = requestAnimationFrame(animateBg);

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(pulseInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="dot-grid hidden md:block"></div>
      <canvas id="bg-canvas" ref={canvasRef}></canvas>
    </>
  );
}
