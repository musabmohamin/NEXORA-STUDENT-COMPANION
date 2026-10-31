import * as React from "react";

export function EduCanvas({ className = "" }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const symbols = [
      "∫ f(x)dx", "λx.x", "O(n log n)", "∇·B = 0", "∑_{i=1}^n",
      "P(A|B)", "∀x ∈ ℝ", "E = mc²", "det(A)", "∂u/∂t",
      "{0, 1}*", "log₂(N)", "lim_{x→0}", "d/dx", "π ≈ 3.1415",
    ];

    const particles: {
      x: number;
      y: number;
      text: string;
      speed: number;
      opacity: number;
      size: number;
    }[] = [];

    const count = Math.min(18, Math.floor(width / 70));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        text: symbols[Math.floor(Math.random() * symbols.length)],
        speed: 0.15 + Math.random() * 0.25,
        opacity: 0.04 + Math.random() * 0.08,
        size: 11 + Math.random() * 4,
      });
    }

    let lastTime = 0;
    const interval = 1000 / 20; // 20 FPS to keep CPU near 0%

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);
      const delta = currentTime - lastTime;
      if (delta < interval) return;
      lastTime = currentTime - (delta % interval);

      ctx.clearRect(0, 0, width, height);
      ctx.font = "600 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speed;
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        ctx.fillStyle = `rgba(15, 30, 65, ${p.opacity})`;
        ctx.fillText(p.text, p.x, p.y);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      aria-hidden="true"
    />
  );
}

export default EduCanvas;
