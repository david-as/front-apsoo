import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const userData = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (response.ok) {
      return NextResponse.json(
        { message: "User registered successfully" },
        { status: 200 }
      );
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Registration failed" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
