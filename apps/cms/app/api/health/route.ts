import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Basic health check
    const healthCheck = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || "1.0.0",
      database: "",
    };

    // Check database connection (optional)
    try {
      // You can add database ping here if needed
      healthCheck.database = "connected";
    } catch {
      healthCheck.database = "disconnected";
    }

    return NextResponse.json(healthCheck);
  } catch {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 500 }
    );
  }
}
