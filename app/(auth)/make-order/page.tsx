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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

type Product = {
  id: number;
  name: string;
  price: number;
};

type FormInputs = {
  selectedProducts: number[];
  restaurantId: string;
};

type Restaurant = {
  id: number;
  name: string;
  valor: number;
};

type OrderData = {
  products: Product[];
  restaurantId: string;
  orderId: number;
};

type PaymentData = {
  orderId: number;
  products: Product[];
  restaurantId: string;
  total: number;
};

function MakeOrderContent() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("status");

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      selectedProducts: [],
    },
  });

  const handleProductSelection = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const calculateTotal = () => {
    return selectedProducts
      .reduce((sum, id) => {
        const product = products.find((p) => p.id === id);
        return sum + (product ? product.price : 0);
      }, 0)
      .toFixed(2);
  };

  // Mock products
  const products: Product[] = [
    { id: 1, name: "Pizza Margherita", price: 12.99 },
    { id: 2, name: "Burger", price: 8.99 },
    { id: 3, name: "Pasta Carbonara", price: 10.99 },
    { id: 4, name: "Caesar Salad", price: 7.99 },
    { id: 5, name: "Fish and Chips", price: 11.99 },
  ];

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
    const selectedProductsData = products.filter((p) =>
      selectedProducts.includes(p.id)
    );
    const total = parseFloat(calculateTotal());

    try {
      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          products: selectedProductsData,
          restaurantId: data.restaurantId,
          status: "Pendente Pagamento",
          valor: total,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Order created:", result);
        setOrderData({
          products: selectedProductsData,
          restaurantId: data.restaurantId,
          orderId: result.id,
        });
        makePayment({
          orderId: uuidv4(),
          products: selectedProductsData,
          total,
          ...data,
          id: uuidv4(),
          title: `new-order-${uuidv4()}`,
          quantity: +total,
          back_url: "https://main--rurafood.netlify.app/order-status/",
        });
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

  console.log(selectedProducts);

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
          <CardDescription>
            Select your items and place your order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Select Products</Label>
              {products.map((product) => (
                <div key={product.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`product-${product.id}`}
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => handleProductSelection(product.id)}
                  />
                  <Label htmlFor={`product-${product.id}`}>
                    {product.name} - ${product.price.toFixed(2)}
                  </Label>
                </div>
              ))}
              {errors.selectedProducts && (
                <p className="text-red-500">
                  {errors.selectedProducts.message}
                </p>
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

            <div>
              <p>
                Total: $
                {selectedProducts
                  .reduce((sum, id) => {
                    const product = products.find((p) => p.id === parseInt(id));
                    return sum + (product ? product.price : 0);
                  }, 0)
                  .toFixed(2)}
              </p>
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
    </div>
  );
}

export default function MakeOrderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MakeOrderContent />
    </Suspense>
  );
}
