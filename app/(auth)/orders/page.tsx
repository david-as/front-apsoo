"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Order = {
  created: string;
  id: number;
  status: string;
  valor: number;
};

export default function RestaurantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  console.log(orders);
  const router = useRouter();

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

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/order/update/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Orders</CardTitle>
          <CardDescription>View your incoming orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.created).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status.toLowerCase().includes("pago")
                          ? "default"
                          : order.status.includes("Pendente")
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        order.status.toLowerCase().includes("pago")
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : ""
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>R$ {order.valor.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() =>
                        updateOrderStatus(order.id, "Preparando pedido")
                      }
                      disabled={!order.status.includes("pago")}
                    >
                      Preparando pedido
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        updateOrderStatus(order.id, "Saiu para entrega")
                      }
                      disabled={order.status !== "Preparando pedido"}
                      className="ml-2"
                    >
                      Saiu para entrega
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
