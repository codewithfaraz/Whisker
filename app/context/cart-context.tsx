"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { Product, CartItem, Cart } from "@/app/lib/types";

interface CartContextType {
  cart: Cart;
  items: CartItem[];
  itemCount: number;
  addToCart: (
    product: Product,
    quantity?: number,
    variants?: { [key: string]: string },
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SHIPPING_COST = 5.99;
const FREE_SHIPPING_THRESHOLD = 50;
const TAX_RATE = 0.08;

function calculateCart(items: CartItem[]): Cart {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return {
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("whiskers-cart");
    if (savedCart) {
      try {
        const parsedItems = JSON.parse(savedCart);
        setItems(parsedItems);
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage when items change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("whiskers-cart", JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addToCart = useCallback(
    (
      product: Product,
      quantity: number = 1,
      variants?: { [key: string]: string },
    ) => {
      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => item.product.id === product.id,
        );

        if (existingIndex > -1) {
          const newItems = [...prevItems];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + quantity,
          };
          return newItems;
        }

        return [
          ...prevItems,
          { product, quantity, selectedVariants: variants },
        ];
      });
    },
    [],
  );

  const removeFromCart = useCallback((productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        removeFromCart(productId);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        ),
      );
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (productId: string) => {
      return items.some((item) => item.product.id === productId);
    },
    [items],
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cart = calculateCart(items);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
