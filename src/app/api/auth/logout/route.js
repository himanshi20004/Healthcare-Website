import { NextResponse } from "next/server";

export async function POST() {
    // Create a response object
    const response = NextResponse.json(
        { message: "Logged out successfully" },
        { status: 200 }
    );

    // Clear the authentication cookie by setting it to expire immediately
    response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
        sameSite: "strict",
    });

    return response;
}