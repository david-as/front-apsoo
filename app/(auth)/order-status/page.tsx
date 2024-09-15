"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function OrderStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const status = searchParams.get("status");
    const collectionStatus = searchParams.get("collection_status");

    if (status === "approved" && collectionStatus === "approved") {
      setStatusMessage('Your order was successfully created and payment was approved!');
    } else if (status === "pending" || collectionStatus === "pending") {
      setStatusMessage('Your order was created, but the payment is still pending. Please check back later.');
    } else {
      setStatusMessage('There was an issue with your order or payment. Please try again or contact support.');
    }

    setIsLoading(false);
  }, [searchParams]);

  const handleBackToHome = () => {
    router.push('/');
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
            <p>Payment ID: {searchParams.get('payment_id')}</p>
            <p>Order ID: {searchParams.get('merchant_order_id')}</p>
          </div>
          <Button onClick={handleBackToHome} className="w-full">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
