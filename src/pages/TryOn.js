import React from "react";
import { useNavigate } from "react-router-dom";
import "./TryOn.css";

import gogglesImg from "../assets/tryon/goggles.png";
import clothesImg from "../assets/tryon/clothes.png";
import watchImg from "../assets/tryon/watch.png";
import heroImg from "../assets/tryon/hero.png";

const TryOn = () => {
  const navigate = useNavigate();

  const items = [
    {
      title: "Smart Eyewear",
      subtitle: "Try AR-powered glasses and goggles in real-time.",
      img: gogglesImg,
      route: "/glasses",
    },
    {
      title: "Virtually Try Clothes",
      subtitle: "Preview outfits on your virtual avatar before buying.",
      img: clothesImg,
      route: "/tryon/clothes",
    },
    {
      title: "Wearable Watches",
      subtitle: "See how smartwatches and wearables look on you.",
      img: watchImg,
      route: "/tryon/watches",
    },
  ];

  return (
    <main className="tryon-page">
      <section className="tryon-hero">
        <div className="hero-text">
          <h1>Virtual Try-On</h1>
          
          <p>
            Explore how products look on you before you buy. Powered by
            NeuroZone’s real-time AI try-on engine.
          </p>
          <div className="hero-meta">
            <span>• No camera data stored</span>
            <span>• Works on web.</span>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <img src={heroImg} alt="Virtual Try-On Preview" className="hero-img" />
        </div>
      </section>

      <section className="tryon-section-header">
        <h2>Choose a category to begin</h2>
        <p>
          Pick what you want to try on, and we’ll guide you through the
          experience step by step.
        </p>
      </section>

      <section className="tryon-card-banners">
        {items.map((item, index) => (
          <div
            key={index}
            className="banner-card"
            onClick={() => navigate(item.route)}
            style={{ backgroundImage: `url(${item.img})` }}
          >
            <div className="banner-overlay">
              <h3 className="banner-title">{item.title}</h3>
              <button className="banner-btn">Try On Now</button>
            </div>
          </div>
        ))}
      </section>

    </main>
  );
};

export default TryOn;
