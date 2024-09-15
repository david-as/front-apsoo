import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}pedido/listar_pedidos`;
    console.log("Fetching orders from:", url);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if required
        // "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched orders data:", data);
      return NextResponse.json(data);
    } else {
      const errorData = await response.json();
      console.error("Failed to fetch orders:", errorData);
      return NextResponse.json(
        { message: "Failed to fetch orders", error: errorData },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching orders",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
