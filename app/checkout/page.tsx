"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, CreditCard, Lock, Check, Truck } from "lucide-react";
import { useCart } from "@/app/context/cart-context";
import { ShippingAddress } from "@/app/lib/types";

type Step = "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const { cart, items, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateShipping = () => {
    const newErrors: { [key: string]: string } = {};
    if (!shippingAddress.firstName) newErrors.firstName = "Required";
    if (!shippingAddress.lastName) newErrors.lastName = "Required";
    if (!shippingAddress.email) newErrors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(shippingAddress.email))
      newErrors.email = "Invalid email";
    if (!shippingAddress.address) newErrors.address = "Required";
    if (!shippingAddress.city) newErrors.city = "Required";
    if (!shippingAddress.state) newErrors.state = "Required";
    if (!shippingAddress.zipCode) newErrors.zipCode = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors: { [key: string]: string } = {};
    if (!paymentInfo.cardNumber) newErrors.cardNumber = "Required";
    else if (paymentInfo.cardNumber.replace(/\s/g, "").length < 16)
      newErrors.cardNumber = "Invalid card number";
    if (!paymentInfo.cardName) newErrors.cardName = "Required";
    if (!paymentInfo.expiryDate) newErrors.expiryDate = "Required";
    if (!paymentInfo.cvv) newErrors.cvv = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (currentStep === "shipping" && validateShipping()) {
      setCurrentStep("payment");
    } else if (currentStep === "payment" && validatePayment()) {
      setCurrentStep("review");
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOrderComplete(true);
    clearCart();
    setIsProcessing(false);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  // Empty cart redirect
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
        <Link href="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  // Order complete
  if (orderComplete) {
    return (
      <div className="container py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-(--color-success) flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Order Confirmed!</h1>
          <p className="text-(--color-text-secondary) mb-6">
            Thank you for your order. We&apos;ll send you a confirmation email
            shortly.
          </p>
          <p className="text-sm text-(--color-text-muted) mb-6">
            Order #WH-{Math.random().toString(36).substring(2, 8).toUpperCase()}
          </p>
          <Link href="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { id: "shipping", label: "Shipping" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review" },
  ] as const;

  return (
    <div className="container py-6 sm:py-8">
      {/* Back to Cart */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm text-(--color-text-secondary) hover:text-(--color-text) mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Cart
      </Link>

      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 ${
                currentStep === step.id
                  ? "text-(--color-primary)"
                  : steps.findIndex((s) => s.id === currentStep) > idx
                    ? "text-(--color-success)"
                    : "text-(--color-text-muted)"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step.id
                    ? "bg-(--color-primary) text-white"
                    : steps.findIndex((s) => s.id === currentStep) > idx
                      ? "bg-(--color-success) text-white"
                      : "bg-(--color-bg-secondary)"
                }`}
              >
                {steps.findIndex((s) => s.id === currentStep) > idx ? (
                  <Check className="w-4 h-4" />
                ) : (
                  idx + 1
                )}
              </div>
              <span className="hidden sm:block text-sm font-medium">
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-8 sm:w-16 h-px mx-2 sm:mx-4 ${
                  steps.findIndex((s) => s.id === currentStep) > idx
                    ? "bg-(--color-success)"
                    : "bg-(--color-border)"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          {/* Shipping Form */}
          {currentStep === "shipping" && (
            <div className="bg-white rounded-lg border border-(--color-border-light) p-6 animate-fade-in">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.firstName}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        firstName: e.target.value,
                      })
                    }
                    className={`input ${errors.firstName ? "border-(--color-error)" : ""}`}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-(--color-error) mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.lastName}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        lastName: e.target.value,
                      })
                    }
                    className={`input ${errors.lastName ? "border-(--color-error)" : ""}`}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-(--color-error) mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        email: e.target.value,
                      })
                    }
                    className={`input ${errors.email ? "border-(--color-error)" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-xs text-(--color-error) mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        phone: e.target.value,
                      })
                    }
                    className="input"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        address: e.target.value,
                      })
                    }
                    className={`input ${errors.address ? "border-(--color-error)" : ""}`}
                  />
                  {errors.address && (
                    <p className="text-xs text-(--color-error) mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">
                    Apartment, suite, etc.
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.apartment}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        apartment: e.target.value,
                      })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value,
                      })
                    }
                    className={`input ${errors.city ? "border-(--color-error)" : ""}`}
                  />
                  {errors.city && (
                    <p className="text-xs text-(--color-error) mt-1">
                      {errors.city}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          state: e.target.value,
                        })
                      }
                      className={`input ${errors.state ? "border-(--color-error)" : ""}`}
                    />
                    {errors.state && (
                      <p className="text-xs text-(--color-error) mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      ZIP *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          zipCode: e.target.value,
                        })
                      }
                      className={`input ${errors.zipCode ? "border-(--color-error)" : ""}`}
                    />
                    {errors.zipCode && (
                      <p className="text-xs text-(--color-error) mt-1">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="btn btn-primary w-full mt-6 py-3"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Payment Form */}
          {currentStep === "payment" && (
            <div className="bg-white rounded-lg border border-(--color-border-light) p-6 animate-fade-in">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.cardNumber}
                    onChange={(e) =>
                      setPaymentInfo({
                        ...paymentInfo,
                        cardNumber: formatCardNumber(e.target.value),
                      })
                    }
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`input ${errors.cardNumber ? "border-(--color-error)" : ""}`}
                  />
                  {errors.cardNumber && (
                    <p className="text-xs text-(--color-error) mt-1">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Name on Card *
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.cardName}
                    onChange={(e) =>
                      setPaymentInfo({
                        ...paymentInfo,
                        cardName: e.target.value,
                      })
                    }
                    className={`input ${errors.cardName ? "border-(--color-error)" : ""}`}
                  />
                  {errors.cardName && (
                    <p className="text-xs text-(--color-error) mt-1">
                      {errors.cardName}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.expiryDate}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          expiryDate: formatExpiryDate(e.target.value),
                        })
                      }
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`input ${errors.expiryDate ? "border-(--color-error)" : ""}`}
                    />
                    {errors.expiryDate && (
                      <p className="text-xs text-(--color-error) mt-1">
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      CVV *
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cvv}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                        })
                      }
                      placeholder="123"
                      maxLength={4}
                      className={`input ${errors.cvv ? "border-(--color-error)" : ""}`}
                    />
                    {errors.cvv && (
                      <p className="text-xs text-(--color-error) mt-1">
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 p-3 bg-(--color-bg-secondary) rounded-lg text-xs text-(--color-text-secondary)">
                <Lock className="w-4 h-4" />
                Your payment information is secure and encrypted.
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setCurrentStep("shipping")}
                  className="btn btn-secondary flex-1 py-3"
                >
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  className="btn btn-primary flex-1 py-3"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Review */}
          {currentStep === "review" && (
            <div className="bg-white rounded-lg border border-(--color-border-light) p-6 animate-fade-in">
              <h2 className="text-lg font-semibold mb-4">Review Your Order</h2>

              {/* Shipping Summary */}
              <div className="mb-6 pb-6 border-b border-(--color-border-light)">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-sm">Shipping Address</h3>
                  <button
                    onClick={() => setCurrentStep("shipping")}
                    className="text-xs text-(--color-primary)"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-(--color-text-secondary)">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                  <br />
                  {shippingAddress.address}
                  {shippingAddress.apartment &&
                    `, ${shippingAddress.apartment}`}
                  <br />
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.zipCode}
                  <br />
                  {shippingAddress.email}
                </p>
              </div>

              {/* Payment Summary */}
              <div className="mb-6 pb-6 border-b border-(--color-border-light)">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-sm">Payment Method</h3>
                  <button
                    onClick={() => setCurrentStep("payment")}
                    className="text-xs text-(--color-primary)"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-(--color-text-secondary)">
                  Card ending in {paymentInfo.cardNumber.slice(-4)}
                </p>
              </div>

              {/* Items Summary */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Items ({items.length})</h3>
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-(--color-bg-secondary) shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-(--color-text-muted)">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setCurrentStep("payment")}
                  className="btn btn-secondary flex-1 py-3"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="btn btn-primary flex-1 py-3"
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-lg border border-(--color-border-light) p-6">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

            {/* Items Preview */}
            <div className="space-y-3 mb-4 pb-4 border-b border-(--color-border-light)">
              {items.slice(0, 3).map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-(--color-bg-secondary) shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-(--color-text) text-white text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-(--color-text-muted)">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {items.length > 3 && (
                <p className="text-xs text-(--color-text-muted)">
                  +{items.length - 3} more item{items.length - 3 > 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-(--color-text-secondary)">Subtotal</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--color-text-secondary)">Shipping</span>
                <span
                  className={
                    cart.shipping === 0 ? "text-(--color-success)" : ""
                  }
                >
                  {cart.shipping === 0
                    ? "Free"
                    : `$${cart.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--color-text-secondary)">Tax</span>
                <span>${cart.tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-(--color-border) my-3" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
