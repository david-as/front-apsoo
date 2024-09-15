import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}user/users/restaurants`;
    console.log("Fetching restaurants from:", url);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched restaurants data:", data);
      return NextResponse.json(data);
    } else {
      const errorData = await response.json();
      console.error("Failed to fetch restaurants:", errorData);
      return NextResponse.json(
        { message: "Failed to fetch restaurants", error: errorData },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching restaurants",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
