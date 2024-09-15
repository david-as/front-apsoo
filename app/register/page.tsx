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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type FormInputs = {
  name: string;
  restaurantName: string;
  email: string;
  password: string;
  cpf: string;
  cnpj: string;
};

export default function RegisterPage() {
  const [userType, setUserType] = useState("person");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setError("");
    setIsSuccess(false);

    const userData = {
      name: userType === "person" ? data.name : data.restaurantName,
      email: data.email,
      password: data.password,
      type: userType.toUpperCase(),
      cpf: data.cpf,
      cnpj: data.cnpj,
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Registration Successful</CardTitle>
            <CardDescription>Your account has been created</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-green-600 mb-4">
              Your account has been successfully created!
            </p>
            <Button className="w-full" onClick={() => router.push("/")}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <RadioGroup
              defaultValue="person"
              onValueChange={setUserType}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="person" id="person" />
                <Label htmlFor="person">Person</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="restaurant" id="restaurant" />
                <Label htmlFor="restaurant">Restaurant</Label>
              </div>
            </RadioGroup>

            {userType === "person" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    {...register("cpf", { required: "CPF is required" })}
                  />
                  {errors.cpf && <p className="text-red-500">{errors.cpf.message}</p>}
                </div>
              </>
            )}

            {userType === "restaurant" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">Restaurant Name</Label>
                  <Input
                    id="restaurantName"
                    placeholder="Delicious Bites"
                    {...register("restaurantName", { required: "Restaurant name is required" })}
                  />
                  {errors.restaurantName && <p className="text-red-500">{errors.restaurantName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    {...register("cnpj", { required: "CNPJ is required" })}
                  />
                  {errors.cnpj && <p className="text-red-500">{errors.cnpj.message}</p>}
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email", { required: "Email is required", pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address",
                }})}
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: "Password is required", minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                }})}
              />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.push("/login")}>
            Already have an account? Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
