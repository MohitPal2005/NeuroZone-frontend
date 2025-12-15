// src/pages/TryOnClothesLive.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TryOnClothes from "./TryOnClothes";
import "./TryOnClothesLive.css"; 

const TryOnClothesLive = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cloth } = location.state || {};

  if (!cloth)
    return (
      <div className="no-cloth-wrapper">
        <p>No cloth selected.</p>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );

  return (
    <div className="tryon-clothes-live-page">

      {/* HEADER */}
      <div className="tryon-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2>Virtual Clothes Try-On</h2>
      </div>

      {/* MAIN CONTENT */}
      <div className="tryon-content">
        
        {/* Webcam Frame */}
        <div className="tryon-video-frame">
          <TryOnClothes selectedShirt={cloth.image} />
        </div>

        {/* Info Panel */}
        <div className="cloth-info-card">
          <h3>Virtual Try-On Active</h3>
          <p className="info-text">
            Move back slightly and align your shoulders — the shirt will auto-fit using AI.
          </p>

          <div className="cloth-preview">
            <img src={cloth.image} alt={cloth.name} />
          </div>

          <p className="tip">AI pose tracking adjusts size & position in real-time.</p>
        </div>
      </div>
    </div>
  );
};

export default TryOnClothesLive;
