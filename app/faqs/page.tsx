"use client";

import { useState } from "react";
import { Plus, Minus, Search, HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "Where is Whisker's Haven located?",
        a: "We are headquartered in California, USA, but we ship our premium cat products to feline lovers worldwide!",
      },
      {
        q: "Do you have physical stores?",
        a: "Currently, we are an online-only boutique. This allows us to keep our costs down and pass those savings on to you in the form of higher-quality materials.",
      },
    ],
  },
  {
    category: "Products",
    questions: [
      {
        q: "Are your foods and treats organic?",
        a: "Many of our items are organic! Look for the 'Organic' badge on the product page. All our foods are grain-free and free from artificial colors/preservatives.",
      },
      {
        q: "What if my cat doesn't like the toy I bought?",
        a: "Cats can be picky! That's why we offer a 30-day return policy. If Oscar isn't interested in his new toy, send it back for a full refund.",
      },
    ],
  },
  {
    category: "Shipping & Orders",
    questions: [
      {
        q: "How can I track my order?",
        a: "Once your order ships, you'll receive an email with a tracking link. You can also view your order status in your account dashboard.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free standard shipping on all domestic orders over $50.",
      },
    ],
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("General-0");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <div className="container py-16 sm:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-(--color-primary-light) rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-(--color-primary)" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-(--color-text) mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-(--color-text-secondary)">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search for questions..."
            className="input pl-14! py-6 rounded-2xl text-base shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-12">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((category) => (
              <div key={category.category}>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-(--color-primary) rounded-full" />
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, idx) => {
                    const id = `${category.category}-${idx}`;
                    const isOpen = openIndex === id;
                    return (
                      <div
                        key={id}
                        className={`group border border-(--color-border-light) rounded-2xl overflow-hidden transition-all ${isOpen ? "bg-white shadow-md border-(--color-primary)/20" : "bg-white hover:border-(--color-border)"}`}
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : id)}
                          className="w-full flex items-center justify-between p-6 text-left"
                        >
                          <span
                            className={`font-semibold transition-colors ${isOpen ? "text-(--color-primary)" : "text-(--color-text)"}`}
                          >
                            {faq.q}
                          </span>
                          {isOpen ? (
                            <Minus className="w-5 h-5 text-(--color-primary) shrink-0" />
                          ) : (
                            <Plus className="w-5 h-5 text-(--color-text-muted) shrink-0 group-hover:text-(--color-text)" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6 text-(--color-text-secondary) leading-relaxed animate-in slide-in-from-top-2 duration-300">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-(--color-bg-secondary) rounded-3xl">
              <p className="text-(--color-text-secondary)">
                No questions found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Support CTA */}
        <div className="mt-20 text-center bg-(--color-primary-light) p-10 rounded-3xl">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-(--color-text-secondary) mb-6 text-sm">
            Can&apos;t find what you&apos;re looking for? Our support team is
            purr-fectly happy to help.
          </p>
          <a href="/contact" className="btn btn-primary px-8 py-3 rounded-xl">
            Reach Out to Us
          </a>
        </div>
      </div>
    </div>
  );
}
