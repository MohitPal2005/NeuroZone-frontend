import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";

export const applyCoupon = async (couponId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const couponRef = doc(db, "users", user.uid, "coupons", couponId);
    await updateDoc(couponRef, { used: true });
  } catch (err) {
    console.error("Failed to apply coupon", err);
    throw err;
  }
};

export const getUserCoupons = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const couponsSnap = await getDocs(collection(db, "users", user.uid, "coupons"));
    return couponsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Failed to fetch coupons", err);
    return [];
  }
};

export const saveCoupon = async (coupon) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const couponsCol = collection(db, "users", user.uid, "coupons");
    const q = query(
      couponsCol,
      where("createdAt", ">=", startOfDay),
      where("createdAt", "<=", endOfDay)
    );
    const existingCouponsSnap = await getDocs(q);

    if (existingCouponsSnap.size >= 2) {
      throw new Error("Daily coupon limit reached (max 2 per day).");
    }

    const couponRef = doc(collection(db, "users", user.uid, "coupons"));
    await setDoc(couponRef, { ...coupon, createdAt: new Date(), used: false });

    return { id: couponRef.id, ...coupon };
  } catch (err) {
    console.error("Failed to save coupon", err);
    throw err;
  }
};

export const clearUserCart = async (userId) => {
  try {
    const cartSnap = await getDocs(collection(db, "users", userId, "cartItems"));
    const promises = cartSnap.docs.map(docSnap =>
      deleteDoc(doc(db, "users", userId, "cartItems", docSnap.id))
    );
    await Promise.all(promises);
  } catch (err) {
    console.error("Failed to clear cart", err);
    throw err;
  }
};
