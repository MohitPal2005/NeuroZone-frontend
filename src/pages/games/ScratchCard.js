import React, { useRef, useEffect, useState } from "react";
import { saveCoupon, getUserCoupons } from "../../utils/firestore";
import { toast } from "react-toastify";
import "../GamesPage.css"; 

const ScratchCard = () => {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [canScratch, setCanScratch] = useState(true);
  const [currentPrize, setCurrentPrize] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const allCoupons = await getUserCoupons();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date();
        tomorrow.setHours(23, 59, 59, 999);

        const todayCoupons = allCoupons.filter(c => {
          const created = c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
          return created >= today && created <= tomorrow;
        });

        setCoupons(todayCoupons);
        setCanScratch(todayCoupons.length < 2);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (revealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle = "#999";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "destination-out";

    let isDrawing = false;
    const getPointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX ? e.clientX - rect.left : e.touches[0].clientX - rect.left,
        y: e.clientY ? e.clientY - rect.top : e.touches[0].clientY - rect.top,
      };
    };

    const start = (e) => { isDrawing = true; scratch(e); };
    const stop = () => (isDrawing = false);
    const scratch = (e) => {
      if (!isDrawing) return;
      const { x, y } = getPointer(e);
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, 2 * Math.PI);
      ctx.fill();
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", scratch);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", stop);
    canvas.addEventListener("touchstart", start);
    canvas.addEventListener("touchmove", scratch);
    canvas.addEventListener("touchend", stop);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", scratch);
      canvas.removeEventListener("mouseup", stop);
      canvas.removeEventListener("mouseleave", stop);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", scratch);
      canvas.removeEventListener("touchend", stop);
    };
  }, [revealed]);

  const handleReveal = async () => {
    if (!canScratch) {
      toast.error("Daily coupon limit reached (max 2 per day)");
      return;
    }
    if (!revealed) {
      const couponData = {
        code: `SCRATCH${Math.floor(Math.random() * 9000 + 1000)}`,
        value: Math.floor(Math.random() * 30) + 10,
      };

      try {
        const newCoupon = await saveCoupon(couponData);
        setCoupons(prev => [...prev, newCoupon]);
        setCurrentPrize(`${newCoupon.code} - ${newCoupon.value}% OFF`);
        toast.success(`Coupon ${newCoupon.code} generated!`);
        if (coupons.length + 1 >= 2) setCanScratch(false);
      } catch (err) {
        toast.error(err.message || "Failed to generate coupon");
        setCurrentPrize("Try Again");
      }

      setRevealed(true);
    }
  };

  const handlePlayAgain = () => {
    setRevealed(false);
    setCurrentPrize("");
  };

  return (
    <div className="games-page-container">
      <h1 className="games-page-title">Scratch & Win</h1>
      <div
        style={{
          position: "relative",
          width: "300px",
          maxWidth: "90%",
          height: "200px",
          margin: "50px auto",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          backgroundColor: "#fff",
          cursor: revealed ? "default" : "pointer",
        }}
        onClick={handleReveal}
      >
        <h2
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#00eeff",
            zIndex: 1,
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          {revealed ? currentPrize : ""}
        </h2>
        {!revealed && (
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              touchAction: "none",
            }}
          />
        )}
      </div>
      {revealed && (
        <button
          onClick={handlePlayAgain}
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            fontSize: "1rem",
            cursor: "pointer",
            borderRadius: "8px",
            backgroundColor: "#00eeff",
            color: "#121212",
            border: "none",
          }}
        >
          Play Again
        </button>
      )}
      <div className="my-coupons" style={{ marginTop: "30px", textAlign: "center" }}>
        <h3>Today's Coupons:</h3>
        {coupons.length === 0 && <p>No coupons yet</p>}
        {coupons.map(c => (
          <p key={c.id}>{c.code} - {c.value}% OFF</p>
        ))}
      </div>
    </div>
  );
};

export default ScratchCard;
