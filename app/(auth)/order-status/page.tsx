"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
type Order = {
  created: string;
  id: number;
  status: string;
  valor: number;
};

function OrderStatusContent() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders?sort=asc", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orders.length === 0) return;
    const status = searchParams.get("status");
    const collectionStatus = searchParams.get("collection_status");

    if (status === "approved" && collectionStatus === "approved") {
      setStatusMessage(
        "Your order was successfully created and payment was approved!"
      );
      updateOrderStatus(orders[orders.length - 1].id);
    } else if (status === "pending" || collectionStatus === "pending") {
      setStatusMessage(
        "Your order was created, but the payment is still pending. Please check back later."
      );
    } else {
      setStatusMessage(
        "There was an issue with your order or payment. Please try again or contact support."
      );
    }

    setIsLoading(false);
  }, [orders, searchParams]);

  const handleBackToHome = () => {
    router.push("/orders");
  };

  const updateOrderStatus = async (orderId: string | number | null) => {
    if (!orderId) return;

    try {
      const response = await fetch(`/api/order/update/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Pago Com sucesso" }),
      });

      if (!response.ok) {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
          <CardDescription>
            Here&apos;s the status of your recent order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">{statusMessage}</p>
          <div className="text-sm text-gray-500 mb-4">
            <p>Payment ID: {searchParams.get("payment_id")}</p>
            <p>Order ID: {searchParams.get("merchant_order_id")}</p>
          </div>
          <Button onClick={handleBackToHome} className="w-full">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderStatusPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderStatusContent />
    </Suspense>
  );
}
