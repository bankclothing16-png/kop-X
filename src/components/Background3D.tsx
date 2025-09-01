import React, { useEffect, useRef } from 'react';

export const Background3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      opacity: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      for (let i = 0; i < 150; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          vz: Math.random() * 2 + 1,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(6, 8, 25, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z -= particle.vz;

        if (particle.z <= 0) {
          particle.z = 1000;
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }

        const scale = 1000 / (1000 - particle.z);
        const x2d = particle.x * scale;
        const y2d = particle.y * scale;
        const size2d = particle.size * scale;

        if (x2d > -50 && x2d < canvas.width + 50 && y2d > -50 && y2d < canvas.height + 50) {
          const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size2d);
          gradient.addColorStop(0, `rgba(59, 130, 246, ${particle.opacity * scale / 10})`);
          gradient.addColorStop(0.5, `rgba(147, 51, 234, ${particle.opacity * scale / 15})`);
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
          ctx.fill();
        }

        // Connect nearby particles
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const opacity = (1 - distance / 100) * 0.3;
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x2d, y2d);
            ctx.lineTo(
              otherParticle.x * (1000 / (1000 - otherParticle.z)),
              otherParticle.y * (1000 / (1000 - otherParticle.z))
            );
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{
        background: 'linear-gradient(135deg, #0F0C29 0%, #24243e 50%, #302B63 100%)'
      }}
    />
  );
};