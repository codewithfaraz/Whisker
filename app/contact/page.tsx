"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "Order Status",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "Order Status",
          message: "",
        });
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-16 sm:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-(--color-text) mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-(--color-text-secondary)">
            Have a question about an order or a specific product? We&apos;re
            here to help!
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Info Side */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-(--color-bg-secondary) p-8 rounded-3xl h-full">
              <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-5 h-5 text-(--color-primary)" />
                  </div>
                  <div>
                    <p className="font-semibold">Email Us</p>
                    <p className="text-sm text-(--color-text-secondary)">
                      hello@whiskershaven.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="w-5 h-5 text-(--color-primary)" />
                  </div>
                  <div>
                    <p className="font-semibold">Call Us</p>
                    <p className="text-sm text-(--color-text-secondary)">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5 text-(--color-primary)" />
                  </div>
                  <div>
                    <p className="font-semibold">Visit Us</p>
                    <p className="text-sm text-(--color-text-secondary)">
                      123 Purr Street, Feline City
                      <br />
                      CAT 90210, USA
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-(--color-border)">
                <p className="font-semibold mb-2">Our Hours</p>
                <div className="text-sm text-(--color-text-secondary) space-y-1">
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p>Sat - Sun: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="md:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white border border-(--color-border-light) p-8 sm:p-10 rounded-3xl shadow-sm"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input"
                >
                  <option>Order Status</option>
                  <option>Product Inquiry</option>
                  <option>Returns & Exchanges</option>
                  <option>Wholesale</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  minLength={10}
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="input resize-none"
                  placeholder="How can we help?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full py-4 rounded-2xl text-base disabled:opacity-70 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
