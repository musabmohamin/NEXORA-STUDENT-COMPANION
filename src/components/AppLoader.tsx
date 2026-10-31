import { useEffect, useState } from "react";

/**
 * Full-screen brand loader shown while the session is restored.
 * Keeps the NEXORA palette (blue-600 / navy) and fades out under 2s.
 */
export function AppLoader({ label = "Preparing your workspace" }: { label?: string }) {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 92 ? 92 : p + Math.max(1, Math.round((92 - p) / 6))));
    }, 120);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-20 w-20 rounded-full bg-blue-600/10 blur-xl" />
        <div className="absolute h-16 w-16 animate-ping rounded-full border border-blue-300/60" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/25">
          <span className="text-lg font-black text-white">N</span>
        </div>
      </div>

      <p className="mt-6 text-sm font-semibold tracking-[0.35em] text-[#0B1B3A]">NEXORA</p>
      <p className="mt-1 text-xs text-gray-400">{label}</p>

      <div className="mt-5 h-[3px] w-44 overflow-hidden rounded-full bg-blue-50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default AppLoader;