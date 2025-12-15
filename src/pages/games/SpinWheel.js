import React, { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import { saveCoupon, getUserCoupons } from "../../utils/firestore";
import { toast } from "react-toastify";
import "../GamesPage.css";

const wheelData = [
  { option: "5% OFF", value: 5, style: { backgroundColor: "#f00", textColor: "#fff" } },
  { option: "10% OFF", value: 10, style: { backgroundColor: "#0f0", textColor: "#000" } },
  { option: "20% OFF", value: 20, style: { backgroundColor: "#00f", textColor: "#fff" } },
  { option: "Free Shipping", value: 0, style: { backgroundColor: "#ff0", textColor: "#000" } },
  { option: "Try Again", value: 0, style: { backgroundColor: "#0ff", textColor: "#000" } },
];

const SpinWheel = () => {
  const [user] = useAuthState(auth);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [prizeText, setPrizeText] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [canSpin, setCanSpin] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      if (!user) return;
      try {
        const allCoupons = await getUserCoupons();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date();
        tomorrow.setHours(23, 59, 59, 999);

        const todayCoupons = allCoupons.filter((c) => {
          const created = c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
          return created >= today && created <= tomorrow;
        });

        setCoupons(todayCoupons);
        setCanSpin(todayCoupons.length < 2);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      }
    };
    fetchCoupons();
  }, [user]);

  const handleSpinClick = () => {
    if (!user) {
      toast.error("Please login first!");
      return;
    }
    if (!canSpin) {
      toast.error("Daily coupon limit reached (max 2 per day)");
      return;
    }

    const index = Math.floor(Math.random() * wheelData.length);
    setPrizeNumber(index);
    setPrizeText("");
    setMustSpin(true);
  };

  const handleStopSpinning = async () => {
    setMustSpin(false);
    const result = wheelData[prizeNumber];
    setPrizeText(result.option);

    if (result.option !== "Try Again") {
      try {
        const couponCode = `SPIN${Math.floor(Math.random() * 9000 + 1000)}`;
        const newCoupon = await saveCoupon({
          code: couponCode,
          value: result.value,   // numeric value
          type: "spin",
        });
        setCoupons((prev) => [...prev, newCoupon]);
        toast.success(`🎉 You won ${result.option}! Coupon: ${couponCode}`);
        if (coupons.length + 1 >= 2) setCanSpin(false);
      } catch (err) {
        toast.error("Failed to save coupon");
      }
    } else {
      toast.info("😢 No prize this time. Try again tomorrow!");
    }
  };

  return (
    <div className="games-page-container">
      <h1 className="games-page-title">Spin the Wheel</h1>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData}
          onStopSpinning={handleStopSpinning}
          backgroundColors={["#121212", "#222"]}
          textColors={["#fff"]}
        />

        <button
          className="spin-button"
          onClick={handleSpinClick}
          disabled={mustSpin || !canSpin}
          style={{
            marginTop: "30px",
            padding: "12px 30px",
            fontSize: "1rem",
            cursor: mustSpin || !canSpin ? "not-allowed" : "pointer",
            borderRadius: "8px",
            backgroundColor: canSpin ? "#00eeff" : "#888",
            color: "#121212",
            border: "none",
          }}
        >
          {mustSpin ? "Spinning..." : canSpin ? "Spin" : "Daily Limit Reached"}
        </button>

        {prizeText && <h2 style={{ marginTop: "20px" }}>You won: {prizeText}</h2>}

        <div className="my-coupons" style={{ marginTop: "40px" }}>
          <h3>🎟️ Today's Coupons:</h3>
          {coupons.map((c) => (
            <p key={c.id}>
              {c.code} - {c.value > 0 ? `${c.value}% OFF` : "Free Shipping"}
            </p>
          ))}
          {coupons.length === 0 && <p>No coupons yet</p>}
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
