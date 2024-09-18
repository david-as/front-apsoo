import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useState } from "react";

interface RestaurantOrderUpdateProps {
  orderId: string;
  currentStatus: string;
  onStatusUpdate: (newStatus: string) => void;
}

export function RestaurantOrderUpdate({
  orderId,
  currentStatus,
  onStatusUpdate,
}: RestaurantOrderUpdateProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/order/update/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      onStatusUpdate(status);
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Select value={status} onChange={handleStatusChange}>
        <option value="Pago Com sucesso">Pago Com sucesso</option>
        <option value="Preparando pedido">Preparando pedido</option>
        <option value="Saiu para entrega">Saiu para entrega</option>
      </Select>
      <Button
        onClick={handleUpdateStatus}
        disabled={isUpdating || status === currentStatus}
      >
        {isUpdating ? "Updating..." : "Update Status"}
      </Button>
    </div>
  );
}
