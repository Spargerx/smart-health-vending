import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { uid, age, allergy, number } = body;

        if (!uid) {
            return NextResponse.json(
                { success: false, message: "Student ID is required" },
                { status: 400 }
            );
        }

        // Validate age if provided
        if (age !== undefined && age !== null) {
            const ageNum = parseInt(age);
            if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
                return NextResponse.json(
                    { success: false, message: "Invalid age. Must be between 1 and 150." },
                    { status: 400 }
                );
            }
        }

        // Call Python backend
        const backendUrl = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";
        const response = await fetch(`${backendUrl}/update-profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid, age, allergy, number }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: data.message || "Failed to update profile" },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
