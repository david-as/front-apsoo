import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const orderData = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}pedido/criar_pedido`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to create order" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the order" },
      { status: 500 }
    );
  }
}
