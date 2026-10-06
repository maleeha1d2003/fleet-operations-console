export interface PerformanceStats {
  lastFrameMs: number;
  maxFrameMs: number;
  averageFrameMs: number;
  samples: number;
}

let frameSamples: number[] = [];
let animationFrameId: number | null = null;
let lastFrameTime = 0;

export function startPerformanceLogger(): () => void {
  frameSamples = [];
  lastFrameTime = performance.now();

  const tick = (time: number) => {
    const frameTime = time - lastFrameTime;
    lastFrameTime = time;

    if (frameTime > 0 && frameTime < 1000) {
      frameSamples.push(frameTime);
      if (frameSamples.length > 120) frameSamples.shift();
    }

    animationFrameId = requestAnimationFrame(tick);
  };

  animationFrameId = requestAnimationFrame(tick);

  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };
}

export function recordUpdatePerformance(): PerformanceStats {
  const samples = [...frameSamples];
  const lastFrameMs = samples.length ? samples[samples.length - 1] : 0;
  const maxFrameMs = samples.length ? Math.max(...samples) : 0;
  const averageFrameMs = samples.length
    ? samples.reduce((sum, value) => sum + value, 0) / samples.length
    : 0;

  const stats = {
    lastFrameMs,
    maxFrameMs,
    averageFrameMs,
    samples: samples.length,
  };

  console.info("[Performance] live update frame metrics", stats);
  return stats;
}
