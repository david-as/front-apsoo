"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormInputs = {
  itemName: string;
  valor: number;
  restaurantId: string;
};

type Restaurant = {
  id: number;
  name: string;
  valor: number;
};

type OrderData = FormInputs & {
  orderId: number;
};

type PaymentData = {
  // Define the structure of your payment data here
  orderId: number;
  // Add other relevant fields
};

export default function MakeOrderPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("status");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("/api/restaurants");
        if (response.ok) {
          const data = await response.json();
          setRestaurants(data);
        } else {
          console.error("Failed to fetch restaurants");
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (paymentStatus) {
      // Handle the payment status (e.g., show a success or failure message)
      if (paymentStatus === "success") {
        // Show success message
        console.log("Payment successful");
      } else if (paymentStatus === "failure") {
        // Show failure message
        console.log("Payment failed");
      }
    }
  }, [paymentStatus]);

  const makePayment = async (data: PaymentData) => {
    try {
      const response = await fetch("/api/order/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Payment link received:", result, response);
        if (result.link_pagamento) {
          window.location.href = result.link_pagamento;
        } else {
          console.error("Payment link not found in the response");
          // Handle error (e.g., show error message to user)
        }
      } else {
        const errorData = await response.json();
        console.error("Payment failed:", errorData);
        // Handle error (e.g., show error message to user)
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          status: "Pendente Pagamento",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Order created:", result);
        setOrderData({ ...data, orderId: result.id });
        makePayment({ ...data, orderId: result.id, id: result.id });
      } else {
        const errorData = await response.json();
        console.error("Failed to create order:", errorData);
        // Handle error (e.g., show error message to user)
      }
    } catch (error) {
      console.error("Error creating order:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {paymentStatus && (
        <div
          className={`mb-4 p-4 rounded ${
            paymentStatus === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {paymentStatus === "success"
            ? "Payment successful!"
            : "Payment failed. Please try again."}
        </div>
      )}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Make an Order</CardTitle>
          <CardDescription>Place your order</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                placeholder="e.g., Pizza Margherita"
                {...register("itemName", { required: "Item name is required" })}
              />
              {errors.itemName && (
                <p className="text-red-500">{errors.itemName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Value</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 100.00"
                {...register("valor", {
                  required: "Value is required",
                  min: { value: 0, message: "Value must be positive" },
                })}
              />
              {errors.valor && (
                <p className="text-red-500">{errors.valor.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurantId">Restaurant</Label>
              <Select
                onValueChange={(value) => setValue("restaurantId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a restaurant" />
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map((restaurant) => (
                    <SelectItem
                      key={restaurant.id}
                      value={restaurant.id.toString()}
                    >
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.restaurantId && (
                <p className="text-red-500">{errors.restaurantId.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </CardFooter>
      </Card>
      {/* {orderData && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          orderData={orderData}
        />
      )} */}
    </div>
  );
}
