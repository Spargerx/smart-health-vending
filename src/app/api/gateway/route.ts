import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Action = "verify-barcode" | "get-student-profile" | "update-language" | "analyze-health";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, payload } = body;

        if (!action) {
            return NextResponse.json(
                { error: "Missing action", success: false },
                { status: 400 }
            );
        }

        const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";
        let endpoint = "";
        let method = "POST";
        let backendPayload: any = payload;

        // Dispatch logic
        switch (action as Action) {
            case "verify-barcode":
                endpoint = "/api/read-barcode";
                // Ensure image format is correct for backend
                if (payload.image && !payload.image.includes("base64")) {
                    // If it's just the base64 string without prefix, backend might expect it as is or with prefix
                    // The previous implementation sent just the base64 string in 'image' field
                }
                break;

            case "get-student-profile":
                if (!payload.uid) {
                    return NextResponse.json({ error: "Missing uid", success: false }, { status: 400 });
                }
                endpoint = `/api/student-profile/${encodeURIComponent(payload.uid)}`;
                method = "GET";
                backendPayload = undefined; // GET requests don't have body
                break;

            case "update-language":
                endpoint = "/api/update-language";
                break;

            case "analyze-health":
                endpoint = "/api/analyze";
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid action", success: false },
                    { status: 400 }
                );
        }

        // Make request to Python backend
        const url = `${pythonBackendUrl}${endpoint}`;
        const options: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (method !== "GET" && backendPayload) {
            options.body = JSON.stringify(backendPayload);
        }

        // Add timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
        options.signal = controller.signal;

        try {
            const response = await fetch(url, options);
            clearTimeout(timeoutId);

            if (!response.ok) {
                // Try to parse error from backend
                let errorData = {};
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { message: response.statusText };
                }

                return NextResponse.json(
                    {
                        success: false,
                        error: "Backend error",
                        details: errorData,
                        status: response.status
                    },
                    { status: response.status }
                );
            }

            const data = await response.json();
            return NextResponse.json(data);

        } catch (fetchError: any) {
            clearTimeout(timeoutId);
            console.error(`Gateway error for action ${action}:`, fetchError);

            let errorMessage = "Failed to connect to backend";
            let status = 502;

            if (fetchError.name === "AbortError") {
                errorMessage = "Request timeout";
                status = 504;
            } else if (fetchError.code === "ECONNREFUSED") {
                errorMessage = "Backend service unavailable";
                status = 503;
            }

            return NextResponse.json(
                { error: errorMessage, success: false, details: fetchError.message },
                { status }
            );
        }

    } catch (error: any) {
        console.error("Gateway internal error:", error);
        return NextResponse.json(
            { error: "Internal server error", success: false, details: error.message },
            { status: 500 }
        );
    }
}
