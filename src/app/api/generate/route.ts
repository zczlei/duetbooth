import { NextResponse } from "next/server";

/**
 * Legacy sync endpoint — use async jobs instead:
 * POST /api/jobs  →  GET /api/jobs/[id]
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Deprecated",
      message:
        "Use POST /api/jobs to start generation, then poll GET /api/jobs/{id}.",
      code: "USE_ASYNC_JOBS",
    },
    { status: 410 },
  );
}
