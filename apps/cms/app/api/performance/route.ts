import { type NextRequest, NextResponse } from "next/server";
import { PerformanceMonitor } from "@/lib/performance";

export async function GET(request: NextRequest) {
  try {
    const monitor = PerformanceMonitor.getInstance();
    const stats = monitor.getAllStats();
    console.log(request);
    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to get performance stats" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, value } = await request.json();

    if (!name || typeof value !== "number") {
      return NextResponse.json(
        { success: false, error: "Invalid metric data" },
        { status: 400 }
      );
    }

    const monitor = PerformanceMonitor.getInstance();
    monitor.recordMetric(name, value);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to record metric" },
      { status: 500 }
    );
  }
}
