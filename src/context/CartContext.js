import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  getDocs,
  addDoc
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCart(guestCart);
    }
  }, [user]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        if (guestCart.length > 0) {
          const batch = writeBatch(db);
          guestCart.forEach((item) => {
            const itemRef = doc(db, "users", u.uid, "cartItems", item.id);
            batch.set(itemRef, { ...item, addedAt: serverTimestamp(), quantity: item.quantity || 1 }, { merge: true });
          });
          await batch.commit();
          localStorage.removeItem("guestCart");
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const cartCol = collection(db, "users", user.uid, "cartItems");
    const unsub = onSnapshot(cartCol, (snap) => {
      const items = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          addedAt: data.addedAt?.toDate ? data.addedAt.toDate() : data.addedAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
        };
      });
      setCart(items);
    });
    return () => unsub();
  }, [user]);

  const addToCart = async (product, notifyCallback, quantity = 1) => {
    const normalized = {
      id: String(product.id || product["model name"] || Date.now()),
      productId: String(product.id || product["model name"] || Date.now()),
      name: product["model name"] || product.name || "Unnamed Product",
      price: Number(product.price) || 0,
      image: product.image || product.img || product.imageUrl || "",
      quantity: quantity
    };

    if (!user) {
      const existing = cart.find((c) => c.id === normalized.id);
      const newCart = existing
        ? cart.map((c) => c.id === normalized.id ? { ...c, quantity: c.quantity + quantity } : c)
        : [...cart, normalized];
      setCart(newCart);
      localStorage.setItem("guestCart", JSON.stringify(newCart));
      if (notifyCallback) notifyCallback(`${normalized.name} added to cart`);
      return;
    }

    try {
      const itemRef = doc(db, "users", user.uid, "cartItems", normalized.id);
      const snap = await getDoc(itemRef);
      if (snap.exists()) {
        await updateDoc(itemRef, { quantity: snap.data().quantity + quantity, updatedAt: serverTimestamp() });
      } else {
        await setDoc(itemRef, { ...normalized, addedAt: serverTimestamp() });
      }
      if (notifyCallback) notifyCallback(`${normalized.name} added to cart`);
    } catch (err) {
      console.error("Add to cart error:", err);
      if (notifyCallback) notifyCallback("Failed to add to cart");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!productId) return;
    if (!user) {
      const newCart = cart.map((c) => c.id === productId ? { ...c, quantity } : c).filter(c => c.quantity > 0);
      setCart(newCart);
      localStorage.setItem("guestCart", JSON.stringify(newCart));
      return;
    }
    try {
      const itemRef = doc(db, "users", user.uid, "cartItems", String(productId));
      if (quantity <= 0) await deleteDoc(itemRef);
      else await updateDoc(itemRef, { quantity, updatedAt: serverTimestamp() });
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!productId) return;
    if (!user) {
      const newCart = cart.filter(c => c.id !== productId);
      setCart(newCart);
      localStorage.setItem("guestCart", JSON.stringify(newCart));
      return;
    }
    try {
      await deleteDoc(doc(db, "users", user.uid, "cartItems", String(productId)));
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  const checkout = async (extra = {}, notifyCallback) => {
    if (!user) return { error: "Login required" };
    try {
      const cartSnap = await getDocs(collection(db, "users", user.uid, "cartItems"));
      const items = cartSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (!items.length) return { error: "Cart is empty" };

      const total = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0);

      const orderData = {
        userId: user.uid,
        items,
        total,
        status: "Pending",
        createdAt: serverTimestamp(),
        ...extra
      };

      const globalOrderRef = await addDoc(collection(db, "orders"), orderData);
      await setDoc(doc(db, "users", user.uid, "orders", globalOrderRef.id), { ...orderData, id: globalOrderRef.id });

      const batch = writeBatch(db);
      cartSnap.docs.forEach(d => batch.delete(doc(db, "users", user.uid, "cartItems", d.id)));
      await batch.commit();

      if (notifyCallback) notifyCallback("Checkout successful");
      return { ok: true, orderId: globalOrderRef.id };
    } catch (err) {
      console.error("Checkout error:", err);
      return { error: err.message || "Checkout failed" };
    }
  };

const buyNow = async (product, notifyCallback, quantity = 1, extra = {}) => {
  if (!product) return { error: "No product selected" };

  const item = {
    id: String(product.id || product["model name"] || Date.now()),
    productId: String(product.id || product["model name"] || Date.now()),
    name: product["model name"] || product.name || "Unnamed Product",
    price: Number(product.price) || 0,
    image: product.image || product.img || product.imageUrl || "",
    quantity,
  };

  if (!user) {
    if (notifyCallback) notifyCallback("Please log in to place an order");
    return { error: "Not logged in" };
  }

  try {
    const orderData = {
      userId: user.uid,
      items: [item],
      total: item.price * quantity,
      status: "Pending",
      createdAt: serverTimestamp(),
      ...extra,
    };

    const globalOrderRef = await addDoc(collection(db, "orders"), orderData);

    
    await setDoc(
      doc(db, "users", user.uid, "orders", globalOrderRef.id),
      { ...orderData, id: globalOrderRef.id }
    );

    if (notifyCallback) notifyCallback(`Purchased ${item.name} successfully`);

    navigate("/orders");

    return { ok: true, orderId: globalOrderRef.id };
  } catch (err) {
    console.error("Buy now error:", err);
    return { error: err.message || "Buy now failed" };
  }
};

  return (
    <CartContext.Provider
      value={{
        user,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        checkout,
        buyNow,  
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
