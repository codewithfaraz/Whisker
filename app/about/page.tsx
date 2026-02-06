import { Cat, Heart, Shield, Users } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container py-16 sm:py-24">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-(--color-text) mb-6">
          For the Love of Cats
        </h1>
        <p className="text-lg text-(--color-text-secondary) leading-relaxed">
          At Whisker&apos;s Haven, we believe every cat deserves the best.
          Founded by a team of obsessive cat parents, our mission is to provide
          high-quality, sustainable, and stylish products that enhance the lives
          of our feline friends and their humans.
        </p>
      </div>

      {/* Image and Story */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div className="relative aspect-4-3 rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop"
            alt="Our Story"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-(--color-text-secondary)">
            <p>
              It all started in 2024 with a picky ginger cat named Oscar. We
              couldn&apos;t find toys that kept him engaged or beds that
              didn&apos;t stick out like a sore thumb in our living room.
            </p>
            <p>
              We realized that most cat products were either cheaply made or
              eyesores. That&apos;s when Whisker&apos;s Haven was born—a place
              where quality meets design.
            </p>
            <p>
              Today, we source from artisanal makers and use sustainable
              materials to ensure that while your cat is happy, the planet is
              too.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            icon: Heart,
            title: "Cat-First Policy",
            desc: "Every product is tested (and approved) by our team of in-house cats.",
          },
          {
            icon: Shield,
            title: "Premium Quality",
            desc: "We prioritize natural fibers, organic food, and durable materials.",
          },
          {
            icon: Users,
            title: "Community",
            desc: "We support local shelters and cat rescues with every purchase.",
          },
          {
            icon: Cat,
            title: "Ethical Sourcing",
            desc: "Fair wages and environmentally conscious manufacturing.",
          },
        ].map((value, idx) => (
          <div
            key={idx}
            className="bg-(--color-bg-secondary) p-8 rounded-3xl text-center"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <value.icon className="w-6 h-6 text-(--color-primary)" />
            </div>
            <h3 className="font-bold text-lg mb-2">{value.title}</h3>
            <p className="text-sm text-(--color-text-secondary)">
              {value.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
