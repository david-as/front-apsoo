import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const loginData = await request.json();
    console.log('Next.js API received:', loginData); // Add this line

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}auth/login`, // Remove the trailing slash if present in the URL
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      // The data should now contain both user and token
      return NextResponse.json(data, { status: 200 });
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Login failed" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
