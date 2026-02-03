import { Product, Category, Review } from "./types";

// Categories
export const categories: Category[] = [
  {
    id: "cat-1",
    name: "All Products",
    slug: "all",
    description: "Browse all our cat products",
    image: "/categories/all.jpg",
    productCount: 48,
    icon: "grid",
  },
  {
    id: "cat-2",
    name: "Food & Treats",
    slug: "food",
    description: "Premium nutrition for your feline friend",
    image: "/categories/food.jpg",
    productCount: 24,
    icon: "utensils",
  },
  {
    id: "cat-3",
    name: "Toys",
    slug: "toys",
    description: "Keep your cat entertained for hours",
    image: "/categories/toys.jpg",
    productCount: 18,
    icon: "sparkles",
  },
  {
    id: "cat-4",
    name: "Beds & Furniture",
    slug: "beds",
    description: "Cozy spots for your cat to rest",
    image: "/categories/beds.jpg",
    productCount: 12,
    icon: "home",
  },
  {
    id: "cat-5",
    name: "Accessories",
    slug: "accessories",
    description: "Collars, bowls, and essentials",
    image: "/categories/accessories.jpg",
    productCount: 15,
    icon: "tag",
  },
  {
    id: "cat-6",
    name: "Health & Grooming",
    slug: "health",
    description: "Keep your cat healthy and clean",
    image: "/categories/health.jpg",
    productCount: 10,
    icon: "heart",
  },
];

// Generate placeholder images using picsum.photos (reliable placeholder service)
const getProductImage = (name: string, index: number = 0): string => {
  // Use seed based on product name for consistent images
  const seed = name.length + index + name.charCodeAt(0);
  return `https://picsum.photos/seed/${seed}/600/600`;
};

// Products
export const products: Product[] = [
  // Food & Treats
  {
    id: "prod-1",
    name: "Organic Salmon Feast",
    slug: "organic-salmon-feast",
    price: 24.99,
    originalPrice: 29.99,
    description:
      "Premium organic salmon cat food made with wild-caught salmon. Rich in omega-3 fatty acids for a healthy coat and optimal nutrition. No artificial preservatives or fillers.",
    shortDescription: "Wild-caught salmon, grain-free formula",
    images: [
      getProductImage("Salmon Feast", 0),
      getProductImage("Salmon Feast", 1),
    ],
    category: "Food & Treats",
    categorySlug: "food",
    tags: ["organic", "grain-free", "salmon"],
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    stockCount: 45,
    isFeatured: true,
    isBestseller: true,
    variants: [
      {
        id: "size",
        name: "Size",
        type: "size",
        options: [
          { id: "s1", value: "2 lb", priceModifier: 0, inStock: true },
          { id: "s2", value: "5 lb", priceModifier: 15, inStock: true },
          { id: "s3", value: "10 lb", priceModifier: 35, inStock: true },
        ],
      },
    ],
    features: [
      "Wild-caught salmon",
      "No artificial preservatives",
      "Rich in Omega-3",
      "Grain-free",
    ],
  },
  {
    id: "prod-2",
    name: "Chicken & Rice Delight",
    slug: "chicken-rice-delight",
    price: 19.99,
    description:
      "Wholesome chicken and rice formula for everyday nutrition. Made with real chicken as the first ingredient.",
    shortDescription: "Real chicken, digestive support",
    images: [getProductImage("Chicken Rice", 0)],
    category: "Food & Treats",
    categorySlug: "food",
    tags: ["chicken", "rice", "digestive-health"],
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    stockCount: 78,
    features: [
      "Real chicken #1 ingredient",
      "Added probiotics",
      "Supports digestion",
    ],
  },
  {
    id: "prod-3",
    name: "Freeze-Dried Liver Treats",
    slug: "freeze-dried-liver-treats",
    price: 12.99,
    description:
      "Single ingredient freeze-dried chicken liver treats. Perfect for training or as a special reward.",
    shortDescription: "Single ingredient, training treats",
    images: [getProductImage("Liver Treats", 0)],
    category: "Food & Treats",
    categorySlug: "food",
    tags: ["treats", "training", "freeze-dried"],
    rating: 4.9,
    reviewCount: 234,
    inStock: true,
    isNew: true,
    features: ["100% chicken liver", "No additives", "Low calorie"],
  },
  {
    id: "prod-4",
    name: "Tuna Pate Cans (12-Pack)",
    slug: "tuna-pate-cans-12-pack",
    price: 28.99,
    originalPrice: 34.99,
    description:
      "Smooth tuna pate in convenient 3oz cans. Made with real tuna and enhanced with vitamins.",
    shortDescription: "Smooth pate, convenient portions",
    images: [getProductImage("Tuna Pate", 0)],
    category: "Food & Treats",
    categorySlug: "food",
    tags: ["wet-food", "tuna", "pate"],
    rating: 4.6,
    reviewCount: 167,
    inStock: true,
    isBestseller: true,
  },
  {
    id: "prod-5",
    name: "Dental Health Crunches",
    slug: "dental-health-crunches",
    price: 14.99,
    description:
      "Crunchy treats designed to clean teeth and freshen breath while satisfying your cat's cravings.",
    shortDescription: "Cleans teeth, fresh breath",
    images: [getProductImage("Dental Treats", 0)],
    category: "Food & Treats",
    categorySlug: "food",
    tags: ["dental", "treats", "health"],
    rating: 4.3,
    reviewCount: 78,
    inStock: true,
  },
  // Toys
  {
    id: "prod-6",
    name: "Interactive Feather Wand",
    slug: "interactive-feather-wand",
    price: 15.99,
    description:
      "Extendable wand toy with natural feathers. Triggers your cat's hunting instincts for hours of play.",
    shortDescription: "Natural feathers, extendable wand",
    images: [getProductImage("Feather Wand", 0)],
    category: "Toys",
    categorySlug: "toys",
    tags: ["interactive", "feathers", "exercise"],
    rating: 4.7,
    reviewCount: 312,
    inStock: true,
    isFeatured: true,
    features: [
      "Extendable handle",
      "Natural feathers",
      "Stimulates hunting instinct",
    ],
  },
  {
    id: "prod-7",
    name: "Catnip Mouse Set (3-Pack)",
    slug: "catnip-mouse-set",
    price: 9.99,
    description:
      "Adorable plush mice filled with premium organic catnip. Perfect size for batting and carrying.",
    shortDescription: "Organic catnip filled",
    images: [getProductImage("Catnip Mice", 0)],
    category: "Toys",
    categorySlug: "toys",
    tags: ["catnip", "plush", "mouse"],
    rating: 4.4,
    reviewCount: 189,
    inStock: true,
    isBestseller: true,
  },
  {
    id: "prod-8",
    name: "Laser Pointer Toy",
    slug: "laser-pointer-toy",
    price: 11.99,
    description:
      "Automatic laser pointer with random patterns. Battery operated for hands-free play.",
    shortDescription: "Auto-rotating patterns",
    images: [getProductImage("Laser Toy", 0)],
    category: "Toys",
    categorySlug: "toys",
    tags: ["laser", "automatic", "exercise"],
    rating: 4.2,
    reviewCount: 145,
    inStock: true,
    isNew: true,
  },
  {
    id: "prod-9",
    name: "Crinkle Ball Set (6-Pack)",
    slug: "crinkle-ball-set",
    price: 7.99,
    description:
      "Lightweight crinkle balls that make an irresistible sound. Colorful and perfect for solo play.",
    shortDescription: "Crinkle sound, lightweight",
    images: [getProductImage("Crinkle Ball", 0)],
    category: "Toys",
    categorySlug: "toys",
    tags: ["balls", "crinkle", "solo-play"],
    rating: 4.5,
    reviewCount: 223,
    inStock: true,
  },
  {
    id: "prod-10",
    name: "Puzzle Treat Dispenser",
    slug: "puzzle-treat-dispenser",
    price: 22.99,
    description:
      "Interactive puzzle toy that dispenses treats. Keeps your cat mentally stimulated and entertained.",
    shortDescription: "Mental stimulation, slow feeding",
    images: [getProductImage("Puzzle Toy", 0)],
    category: "Toys",
    categorySlug: "toys",
    tags: ["puzzle", "treat-dispenser", "mental-stimulation"],
    rating: 4.6,
    reviewCount: 98,
    inStock: true,
    isFeatured: true,
  },
  // Beds & Furniture
  {
    id: "prod-11",
    name: "Plush Donut Bed",
    slug: "plush-donut-bed",
    price: 39.99,
    originalPrice: 49.99,
    description:
      "Ultra-soft donut-shaped bed with raised edges for security. Machine washable cover.",
    shortDescription: "Ultra-soft, machine washable",
    images: [getProductImage("Donut Bed", 0)],
    category: "Beds & Furniture",
    categorySlug: "beds",
    tags: ["bed", "plush", "cozy"],
    rating: 4.8,
    reviewCount: 267,
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    variants: [
      {
        id: "size",
        name: "Size",
        type: "size",
        options: [
          { id: "s1", value: "Small (40cm)", priceModifier: 0, inStock: true },
          {
            id: "s2",
            value: "Medium (50cm)",
            priceModifier: 10,
            inStock: true,
          },
          {
            id: "s3",
            value: "Large (60cm)",
            priceModifier: 20,
            inStock: false,
          },
        ],
      },
      {
        id: "color",
        name: "Color",
        type: "color",
        options: [
          { id: "c1", value: "Gray", priceModifier: 0, inStock: true },
          { id: "c2", value: "Cream", priceModifier: 0, inStock: true },
          { id: "c3", value: "Pink", priceModifier: 0, inStock: true },
        ],
      },
    ],
  },
  {
    id: "prod-12",
    name: "Cat Tree Tower",
    slug: "cat-tree-tower",
    price: 89.99,
    description:
      "Multi-level cat tree with scratching posts, platforms, and a cozy hideaway. Sturdy base for stability.",
    shortDescription: "Multi-level, sisal scratching posts",
    images: [getProductImage("Cat Tree", 0)],
    category: "Beds & Furniture",
    categorySlug: "beds",
    tags: ["cat-tree", "scratching", "climbing"],
    rating: 4.7,
    reviewCount: 134,
    inStock: true,
    variants: [
      {
        id: "color",
        name: "Color",
        type: "color",
        options: [
          { id: "c1", value: "Beige", priceModifier: 0, inStock: true },
          { id: "c2", value: "Gray", priceModifier: 0, inStock: true },
        ],
      },
    ],
  },
  {
    id: "prod-13",
    name: "Window Perch Hammock",
    slug: "window-perch-hammock",
    price: 29.99,
    description:
      "Suction cup window perch for bird watching. Supports up to 25 lbs with reinforced cups.",
    shortDescription: "Strong suction cups, easy install",
    images: [getProductImage("Window Perch", 0)],
    category: "Beds & Furniture",
    categorySlug: "beds",
    tags: ["window", "hammock", "perch"],
    rating: 4.4,
    reviewCount: 189,
    inStock: true,
    isNew: true,
  },
  {
    id: "prod-14",
    name: "Heated Cat Mat",
    slug: "heated-cat-mat",
    price: 34.99,
    description:
      "Self-warming mat with reflective thermal layer. No electricity needed.",
    shortDescription: "Self-warming, no electricity",
    images: [getProductImage("Heated Mat", 0)],
    category: "Beds & Furniture",
    categorySlug: "beds",
    tags: ["heated", "mat", "self-warming"],
    rating: 4.5,
    reviewCount: 156,
    inStock: true,
  },
  // Accessories
  {
    id: "prod-15",
    name: "Adjustable Breakaway Collar",
    slug: "adjustable-breakaway-collar",
    price: 12.99,
    description:
      "Safety breakaway collar with adjustable fit. Includes a bell and comes in multiple colors.",
    shortDescription: "Safety breakaway, adjustable",
    images: [getProductImage("Cat Collar", 0)],
    category: "Accessories",
    categorySlug: "accessories",
    tags: ["collar", "safety", "breakaway"],
    rating: 4.6,
    reviewCount: 312,
    inStock: true,
    isFeatured: true,
    variants: [
      {
        id: "color",
        name: "Color",
        type: "color",
        options: [
          { id: "c1", value: "Red", priceModifier: 0, inStock: true },
          { id: "c2", value: "Blue", priceModifier: 0, inStock: true },
          { id: "c3", value: "Black", priceModifier: 0, inStock: true },
          { id: "c4", value: "Pink", priceModifier: 0, inStock: true },
        ],
      },
    ],
  },
  {
    id: "prod-16",
    name: "Ceramic Food Bowl Set",
    slug: "ceramic-food-bowl-set",
    price: 18.99,
    description:
      "Elegant ceramic bowls for food and water. Elevated design for comfortable eating.",
    shortDescription: "Elevated design, dishwasher safe",
    images: [getProductImage("Bowl Set", 0)],
    category: "Accessories",
    categorySlug: "accessories",
    tags: ["bowl", "ceramic", "elevated"],
    rating: 4.7,
    reviewCount: 178,
    inStock: true,
    isBestseller: true,
  },
  {
    id: "prod-17",
    name: "Automatic Water Fountain",
    slug: "automatic-water-fountain",
    price: 32.99,
    description:
      "Filtered water fountain encourages hydration. Ultra-quiet pump with LED indicator.",
    shortDescription: "Filtered, ultra-quiet pump",
    images: [getProductImage("Water Fountain", 0)],
    category: "Accessories",
    categorySlug: "accessories",
    tags: ["water", "fountain", "automatic"],
    rating: 4.5,
    reviewCount: 234,
    inStock: true,
    isNew: true,
  },
  {
    id: "prod-18",
    name: "Travel Carrier Bag",
    slug: "travel-carrier-bag",
    price: 44.99,
    description:
      "Airline-approved soft carrier with mesh ventilation. Comfortable shoulder strap.",
    shortDescription: "Airline approved, mesh ventilation",
    images: [getProductImage("Carrier Bag", 0)],
    category: "Accessories",
    categorySlug: "accessories",
    tags: ["carrier", "travel", "airline-approved"],
    rating: 4.6,
    reviewCount: 145,
    inStock: true,
  },
  // Health & Grooming
  {
    id: "prod-19",
    name: "Self-Cleaning Slicker Brush",
    slug: "self-cleaning-slicker-brush",
    price: 16.99,
    description:
      "Gentle slicker brush with retractable bristles for easy cleaning. Removes loose fur and tangles.",
    shortDescription: "Self-cleaning, gentle bristles",
    images: [getProductImage("Slicker Brush", 0)],
    category: "Health & Grooming",
    categorySlug: "health",
    tags: ["grooming", "brush", "self-cleaning"],
    rating: 4.7,
    reviewCount: 267,
    inStock: true,
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: "prod-20",
    name: "Nail Clippers with Light",
    slug: "nail-clippers-light",
    price: 13.99,
    description:
      "Professional-grade nail clippers with built-in LED light. Precise cutting with safety guard.",
    shortDescription: "LED light, safety guard",
    images: [getProductImage("Nail Clipper", 0)],
    category: "Health & Grooming",
    categorySlug: "health",
    tags: ["grooming", "nails", "clippers"],
    rating: 4.4,
    reviewCount: 189,
    inStock: true,
  },
  {
    id: "prod-21",
    name: "Calming Spray",
    slug: "calming-spray",
    price: 19.99,
    description:
      "Natural pheromone spray to reduce stress and anxiety. Perfect for vet visits or travel.",
    shortDescription: "Natural pheromones, reduces stress",
    images: [getProductImage("Calming Spray", 0)],
    category: "Health & Grooming",
    categorySlug: "health",
    tags: ["health", "calming", "stress-relief"],
    rating: 4.3,
    reviewCount: 145,
    inStock: true,
    isNew: true,
  },
  {
    id: "prod-22",
    name: "Hairball Control Supplement",
    slug: "hairball-control-supplement",
    price: 15.99,
    description:
      "Natural fiber supplement to prevent hairballs. Tasty chicken flavor cats love.",
    shortDescription: "Natural fiber, chicken flavor",
    images: [getProductImage("Hairball Sup", 0)],
    category: "Health & Grooming",
    categorySlug: "health",
    tags: ["health", "hairball", "supplement"],
    rating: 4.5,
    reviewCount: 123,
    inStock: true,
  },
  {
    id: "prod-23",
    name: "Premium Catnip (Organic)",
    slug: "premium-catnip-organic",
    price: 8.99,
    description:
      "USDA certified organic catnip. Grown without pesticides for pure enjoyment.",
    shortDescription: "USDA certified organic",
    images: [getProductImage("Organic Catnip", 0)],
    category: "Toys",
    categorySlug: "toys",
    tags: ["catnip", "organic", "natural"],
    rating: 4.8,
    reviewCount: 456,
    inStock: true,
    isBestseller: true,
  },
  {
    id: "prod-24",
    name: "Scratching Post Classic",
    slug: "scratching-post-classic",
    price: 24.99,
    description:
      "Tall sisal scratching post with sturdy base. Satisfies scratching instincts and saves furniture.",
    shortDescription: "Natural sisal, sturdy base",
    images: [getProductImage("Scratch Post", 0)],
    category: "Beds & Furniture",
    categorySlug: "beds",
    tags: ["scratching", "sisal", "furniture"],
    rating: 4.6,
    reviewCount: 234,
    inStock: true,
  },
];

// Helper functions
export const getFeaturedProducts = (): Product[] => {
  return products.filter((p) => p.isFeatured);
};

export const getNewProducts = (): Product[] => {
  return products.filter((p) => p.isNew);
};

export const getBestsellers = (): Product[] => {
  return products.filter((p) => p.isBestseller);
};

export const getProductsByCategory = (categorySlug: string): Product[] => {
  if (categorySlug === "all") return products;
  return products.filter((p) => p.categorySlug === categorySlug);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((p) => p.slug === slug);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getRelatedProducts = (
  product: Product,
  limit: number = 4,
): Product[] => {
  return products
    .filter(
      (p) => p.categorySlug === product.categorySlug && p.id !== product.id,
    )
    .slice(0, limit);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some((t) => t.toLowerCase().includes(lowerQuery)),
  );
};

// Mock reviews
export const reviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    author: "Sarah M.",
    rating: 5,
    title: "My cats love this!",
    content:
      "Finally found a food my picky eater actually enjoys. The salmon smell is fresh and the quality is evident.",
    date: "2024-01-15",
    verified: true,
    helpful: 24,
  },
  {
    id: "rev-2",
    productId: "prod-1",
    author: "Mike T.",
    rating: 4,
    title: "Great quality, slightly pricey",
    content:
      "Excellent ingredients and my cat's coat has never looked better. Just wish it was a bit more affordable.",
    date: "2024-01-10",
    verified: true,
    helpful: 18,
  },
  {
    id: "rev-3",
    productId: "prod-11",
    author: "Jessica L.",
    rating: 5,
    title: "So cozy!",
    content:
      "My cat sleeps in this bed every single night. It's super soft and washes well. Highly recommend!",
    date: "2024-01-20",
    verified: true,
    helpful: 32,
  },
];

export const getProductReviews = (productId: string): Review[] => {
  return reviews.filter((r) => r.productId === productId);
};
