// Performance monitoring and optimization utilities

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure function execution time
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      this.recordMetric(name, performance.now() - start);
      return result;
    } catch (error) {
      this.recordMetric(`${name}-error`, performance.now() - start);
      throw error;
    }
  }

  // Record metric
  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    const values = this.metrics.get(name)!;
    values.push(value);

    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  // Get performance statistics
  getStats(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  // Get all metrics
  getAllStats() {
    const stats: Record<string, unknown> = {};
    for (const [name] of this.metrics) {
      stats[name] = this.getStats(name);
    }
    return stats;
  }
}

// Image optimization utilities
export const imageOptimization = {
  // Generate responsive image props
  getResponsiveImageProps: (src: string, alt: string, priority = false) => ({
    src,
    alt,
    priority,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    style: {
      width: "100%",
      height: "auto",
    },
  }),

  // Generate blur placeholder
  getBlurDataURL: (width: number, height: number) => {
    const canvas =
      typeof window !== "undefined" ? document.createElement("canvas") : null;
    if (!canvas) return undefined;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, width, height);
    return canvas.toDataURL();
  },
};

// Bundle size analyzer
export const bundleAnalyzer = {
  // Log component render performance
  logRender: (componentName: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`🔄 Rendering: ${componentName}`);
    }
  },

  // Measure component mount time
  measureMount: (componentName: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();

    if (process.env.NODE_ENV === "development") {
      console.log(
        `⚡ ${componentName} mounted in ${(end - start).toFixed(2)}ms`
      );
    }
  },
};
