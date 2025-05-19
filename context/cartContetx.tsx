import { createContext, useContext, useState, useEffect } from "react";
import { CardItem } from "@/app/lib/types";
type CartContextType = {
  cartItems: CardItem[];
  addToCart: (item: CardItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CardItem[]>([]);

  // localStorage’dan yükle
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  // localStorage’a yaz
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CardItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
