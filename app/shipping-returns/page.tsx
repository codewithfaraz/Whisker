import { Truck, RotateCcw, ShieldCheck, Globe } from "lucide-react";

export default function ShippingReturnsPage() {
  return (
    <div className="container py-16 sm:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-(--color-text) mb-4">
            Shipping & Returns
          </h1>
          <p className="text-lg text-(--color-text-secondary)">
            Everything you need to know about getting your items and sending
            them back.
          </p>
        </div>

        <div className="space-y-16">
          {/* Shipping Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-(--color-primary-light) rounded-2xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-(--color-primary)" />
              </div>
              <h2 className="text-3xl font-bold">Shipping Policy</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mb-12">
              <div className="bg-(--color-bg-secondary) p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-5 h-5 text-(--color-primary)" />
                  <h3 className="font-bold text-lg">Domestic Shipping</h3>
                </div>
                <div className="space-y-4 text-sm text-(--color-text-secondary)">
                  <p>
                    Standard (3-5 business days): $5.99 or FREE on orders over
                    $50.
                  </p>
                  <p>Express (1-2 business days): $15.99.</p>
                  <p>Orders are processed within 24 hours of being placed.</p>
                </div>
              </div>

              <div className="bg-(--color-bg-secondary) p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-(--color-primary)" />
                  <h3 className="font-bold text-lg">International Shipping</h3>
                </div>
                <div className="space-y-4 text-sm text-(--color-text-secondary)">
                  <p>Standard International (7-14 days): $25.00.</p>
                  <p>
                    Import duties and taxes are the responsibility of the
                    customer.
                  </p>
                  <p>Tracking provided for all international orders.</p>
                </div>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-(--color-text-secondary)">
              <p>
                We ship all orders from our fulfillment center in California.
                Once your order ships, you will receive a confirmation email
                with tracking information.
              </p>
            </div>
          </section>

          {/* Returns Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold">Returns & Exchanges</h2>
            </div>

            <div className="bg-white border border-(--color-border-light) rounded-3xl p-8 sm:p-12 shadow-sm">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">
                    30-Day Happiness Guarantee
                  </h3>
                  <p className="text-(--color-text-secondary)">
                    If you or your cat aren&apos;t 100% happy with your
                    purchase, you can return it within 30 days for a full refund
                    or exchange. Items must be in their original packaging and
                    in like-new condition.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-(--color-primary) uppercase tracking-wider">
                      Step 1
                    </span>
                    <h4 className="font-bold">Initiate Return</h4>
                    <p className="text-sm text-(--color-text-secondary)">
                      Log into your account or contact support to start the
                      process.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-(--color-primary) uppercase tracking-wider">
                      Step 2
                    </span>
                    <h4 className="font-bold">Ship It Back</h4>
                    <p className="text-sm text-(--color-text-secondary)">
                      Print the prepaid label and drop the package at any USPS
                      location.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-(--color-primary) uppercase tracking-wider">
                      Step 3
                    </span>
                    <h4 className="font-bold">Get Refunded</h4>
                    <p className="text-sm text-(--color-text-secondary)">
                      Once received, we'll process your refund within 48 hours.
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-(--color-border)">
                  <h4 className="font-semibold mb-2">Non-Returnable Items:</h4>
                  <ul className="list-disc pl-5 text-sm text-(--color-text-secondary) space-y-1">
                    <li>Opened food or treats (unless they arrived damaged)</li>
                    <li>Personalized items</li>
                    <li>
                      Used cat trees or scratching posts (for hygiene reasons)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
