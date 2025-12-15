import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, query } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateGlobalCoupons() {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = usersSnapshot.docs.map((doc) => doc.id);

    const globalCouponsSnapshot = await getDocs(collection(db, "coupons"));
    const globalCoupons = globalCouponsSnapshot.docs
      .filter((doc) => doc.data().userId === "global")
      .map((doc) => ({ id: doc.id, ...doc.data() }));

    if (globalCoupons.length === 0) {
      console.log("No global coupons found!");
      return;
    }

    for (const userId of users) {
      for (const coupon of globalCoupons) {
        const { id, ...data } = coupon; // remove old ID
        await addDoc(collection(db, `users/${userId}/coupons`), {
          ...data,
          used: false,
          createdAt: new Date(),
        });
        console.log(`✅ Coupon ${data.code} added to user ${userId}`);
      }
    }

    console.log("🎉 All global coupons migrated to users successfully!");
  } catch (err) {
    console.error("Error migrating coupons:", err);
  }
}

migrateGlobalCoupons();
