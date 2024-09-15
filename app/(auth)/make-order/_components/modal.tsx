"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type FormInputs = {
  cardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  cardholderName: string;
  cvv: string;
};

type OrderData = {
  itemName: string;
  valor: number;
  restaurantId: string;
  orderId: number;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orderData: OrderData;
};

export function PaymentModal({ isOpen, onClose, orderData }: ModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      cardNumber: "5031 4332 1540 6351",
      cardholderName: "APROV",
      cvv: "123",
      expirationMonth: "11",
      expirationYear: "25",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/order/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderData,
          ...data,
          title: orderData.itemName,
          quantity: Number(orderData.valor)
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Payment link received:", result,response);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Credit Card Payment</DialogTitle>
          <DialogDescription>
            Enter your payment details securely.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              type="text"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              {...register("cardNumber", {
                required: "Card number is required",
                pattern: {
                  value: /^[0-9\s]{16,19}$/,
                  message: "Invalid card number",
                },
              })}
            />
            {errors.cardNumber && (
              <p className="text-red-500">{errors.cardNumber.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Expiration Date</Label>
              <div className="flex gap-2">
                <Controller
                  name="expirationMonth"
                  control={control}
                  rules={{ required: "Month is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <SelectItem
                              key={month}
                              value={month.toString().padStart(2, "0")}
                            >
                              {month.toString().padStart(2, "0")}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  name="expirationYear"
                  control={control}
                  rules={{ required: "Year is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="YY" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => i + new Date().getFullYear()).map((year) => (
                          <SelectItem key={year} value={year.toString().slice(-2)}>
                            {year.toString().slice(-2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {(errors.expirationMonth || errors.expirationYear) && (
                <p className="text-red-500">
                  {errors.expirationMonth?.message ||
                    errors.expirationYear?.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                inputMode="numeric"
                placeholder="123"
                {...register("cvv", {
                  required: "CVV is required",
                  pattern: {
                    value: /^[0-9]{3,4}$/,
                    message: "Invalid CVV",
                  },
                })}
              />
              {errors.cvv && (
                <p className="text-red-500">{errors.cvv.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              type="text"
              placeholder="John Doe"
              {...register("cardholderName", {
                required: "Cardholder name is required",
              })}
            />
            {errors.cardholderName && (
              <p className="text-red-500">{errors.cardholderName.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Pay"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}