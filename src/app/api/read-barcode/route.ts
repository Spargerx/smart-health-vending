import { NextRequest, NextResponse } from "next/server";

// Ensure we can handle form data
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    let imageFile: File | null = null;

    // Try to parse as JSON first (this is what the frontend sends)
    try {
      const body = await request.json();
      if (body.image) {
        const base64Data = body.image.split(",")[1] || body.image;
        const buffer = Buffer.from(base64Data, "base64");
        imageFile = new File([buffer], "image.jpg", { type: body.format || "image/jpeg" });
      }
    } catch (jsonError) {
      // If JSON parsing fails, try form data fallback
      try {
        const formData = await request.formData();
        imageFile = formData.get("image") as File;
      } catch (formError) {
        console.error("Failed to parse request:", { jsonError, formError });
        return NextResponse.json(
          {
            error: "Invalid request format",
            message: "Expected JSON with base64 image or multipart/form-data with image file",
            success: false
          },
          { status: 400 }
        );
      }
    }

    if (!imageFile || !(imageFile instanceof File)) {
      return NextResponse.json(
        { error: "No image provided or invalid file" },
        { status: 400 }
      );
    }

    // Convert File to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    // Call Python backend service
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";

    let response: Response;
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      response = await fetch(`${pythonBackendUrl}/api/read-barcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          format: imageFile.type || "image/jpeg",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (fetchError) {
      console.error("Failed to connect to Python backend:", fetchError);
      const errorMessage = fetchError instanceof Error ? fetchError.message : "Unknown error";
      const errorName = fetchError instanceof Error ? fetchError.name : "";

      // Check if it's an abort/timeout error
      if (errorName === "AbortError" || errorMessage.includes("timeout") || errorMessage.includes("aborted")) {
        return NextResponse.json(
          {
            error: "Request timeout",
            message: "The verification service took too long to respond. Please try again.",
            success: false
          },
          { status: 504 }
        );
      }

      // Check if it's a connection error
      if (errorMessage.includes("ECONNREFUSED") || errorMessage.includes("fetch failed") || errorMessage.includes("ENOTFOUND")) {
        return NextResponse.json(
          {
            error: "Backend service unavailable",
            message: "The verification service is not running. Please ensure the Python backend is started on port 8000.",
            success: false,
            details: `Failed to connect to ${pythonBackendUrl}. Make sure the Python backend is running.`
          },
          { status: 503 }
        );
      }

      // Other network errors
      return NextResponse.json(
        {
          error: "Network error",
          message: `Failed to connect to verification service: ${errorMessage}`,
          success: false,
          details: `Error connecting to ${pythonBackendUrl}`
        },
        { status: 502 }
      );
    }

    if (!response.ok) {
      let errorData: { error?: string; message?: string; detail?: string } = {};
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          const text = await response.text();
          errorData = { error: text || "Unknown error", message: text || "Verification failed" };
        }
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
        errorData = {
          error: `HTTP ${response.status}`,
          message: response.statusText || "Verification failed"
        };
      }

      console.error("Python backend error:", {
        status: response.status,
        statusText: response.statusText,
        errorData
      });

      return NextResponse.json(
        {
          error: errorData.error || `HTTP ${response.status}`,
          message: errorData.message || errorData.detail || "Verification failed",
          success: false,
          status: response.status
        },
        { status: response.status >= 500 ? 502 : response.status }
      );
    }

    let data: { barcode?: string; success?: boolean; message?: string; firstName?: string; first_name?: string } = {};
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Failed to parse success response:", parseError);
      return NextResponse.json(
        {
          error: "Invalid response",
          message: "The verification service returned an invalid response.",
          success: false
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      barcode: data.barcode || null,
      success: data.success !== false && !!data.barcode,
      message: data.message || (data.barcode ? "Verification successful" : "No barcode found"),
      firstName: data.firstName || data.first_name || null,
    });
  } catch (error) {
    console.error("Barcode reading error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        success: false
      },
      { status: 500 }
    );
  }
}

