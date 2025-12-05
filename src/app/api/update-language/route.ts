import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { uid, language } = body;

        if (!uid || !language) {
            return NextResponse.json(
                { error: "Missing uid or language", success: false },
                { status: 400 }
            );
        }

        const pythonBackendUrl =
            process.env.PYTHON_BACKEND_URL || "http://localhost:8000";

        const response = await fetch(`${pythonBackendUrl}/api/update-language`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid, language }),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to update language", success: false },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Language update error:", error);
        return NextResponse.json(
            { error: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
