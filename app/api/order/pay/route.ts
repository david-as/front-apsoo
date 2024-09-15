import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const paymentData = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}pedido/realizar_pagamento`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
        cache: 'no-store', // Prevent caching
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Payment failed" },
        { 
          status: response.status,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      );
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { message: "An error occurred while processing the payment" },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }
}
