import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json(
        { error: "Missing uid parameter", success: false },
        { status: 400 }
      );
    }

    const pythonBackendUrl =
      process.env.PYTHON_BACKEND_URL || "http://localhost:8000";

    const response = await fetch(
      `${pythonBackendUrl}/api/student-profile/${encodeURIComponent(uid)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      let errorData: { error?: string; message?: string } = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          message: response.statusText || "Failed to fetch student profile",
        };
      }

      return NextResponse.json(
        {
          error: errorData.error || "Failed to fetch student profile",
          message:
            errorData.message || "Unable to fetch student details right now.",
          success: false,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: data.success,
      uid: data.uid || uid,
      firstName: data.firstName || null,
      fullName: data.fullName || null,
      number: data.number || null,
      language: data.language || "English",
      age: data.age || null,
      allergy: data.allergy || null,
      message: data.message,
    });
  } catch (error) {
    console.error("Student profile fetch error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      },
      { status: 500 }
    );
  }
}

