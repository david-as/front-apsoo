import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}pedido/listar_pedidos`;
    console.log("Fetching orders from:", url);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched orders data:", data);

      // Sort the orders by ID in ascending order
      data.sort((a: any, b: any) => a.id - b.id);

      return new NextResponse(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    } else {
      const errorData = await response.json();
      console.error("Failed to fetch orders:", errorData);
      return new NextResponse(
        JSON.stringify({ message: "Failed to fetch orders", error: errorData }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new NextResponse(
      JSON.stringify({
        message: "An error occurred while fetching orders",
        error: String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}
