"use client";

import { useEffect, useRef } from "react";

type Dot = {
  x: number;
  y: number;
  z: number;
  size: number;
  phase: number;
};

export function ParticleOrb() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let frame = 0;
    let time = 0;
    let dots: Dot[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const radius = Math.min(rect.width, rect.height) * 0.36;
      const count = rect.width < 120 ? 150 : 420;
      dots = Array.from({ length: count }, (_, index) => {
        const phi = Math.acos(1 - (2 * (index + 0.5)) / count);
        const theta = Math.PI * (1 + Math.sqrt(5)) * index;
        return {
          x: radius * Math.sin(phi) * Math.cos(theta),
          y: radius * Math.sin(phi) * Math.sin(theta),
          z: radius * Math.cos(phi),
          size: 0.55 + Math.random() * 1.15,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const radius = Math.min(rect.width, rect.height) * 0.36;
      context.clearRect(0, 0, rect.width, rect.height);
      time += 0.003;

      const glow = context.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.45);
      glow.addColorStop(0, "rgba(125,222,216,.16)");
      glow.addColorStop(0.48, "rgba(125,222,216,.045)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, rect.width, rect.height);

      const cos = Math.cos(time * 0.62);
      const sin = Math.sin(time * 0.62);
      const points = dots.map((dot) => {
        const pulse = Math.sin(time * 1.6 + dot.phase) * 2.2;
        const x = (dot.x + pulse) * cos - dot.z * sin;
        const z = (dot.x + pulse) * sin + dot.z * cos;
        const scale = 340 / (340 + z);
        return {
          x: cx + x * scale,
          y: cy + dot.y * scale,
          z,
          size: dot.size * scale,
          opacity: 0.22 + ((z + radius) / (2 * radius)) * 0.7,
        };
      }).sort((a, b) => a.z - b.z);

      points.forEach((point, index) => {
        context.beginPath();
        context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(222,248,245,${point.opacity})`;
        context.fill();

        for (let next = index + 1; next < Math.min(points.length, index + 15); next += 1) {
          const neighbor = points[next];
          const distance = Math.hypot(point.x - neighbor.x, point.y - neighbor.y);
          if (distance < radius * 0.22) {
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(neighbor.x, neighbor.y);
            context.strokeStyle = `rgba(125,222,216,${(1 - distance / (radius * 0.22)) * 0.12})`;
            context.lineWidth = 0.5;
            context.stroke();
          }
        }
      });

      frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particleOrb" aria-label="Сфера Carry AI" />;
}
