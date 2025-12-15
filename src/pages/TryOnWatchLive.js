import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TryOnWatch from "./TryOnWatch";
import "./TryOnWatchLive.css";

const TryOnWatchLive = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedWatch, watch } = location.state || {};

  if (!watch)
    return (
      <div className="no-watch-wrapper">
        <p>No watch selected.</p>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );

  return (
    <div className="tryon-watch-live-page">

      {/* HEADER */}
      <div className="tryon-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2>Virtual Watch Try-On</h2>
      </div>

      {/* MAIN AREA */}
      <div className="tryon-content">

        {/* WEBCAM AREA */}
        <div className="tryon-video-frame">
          <TryOnWatch selectedWatch={selectedWatch} />
        </div>

        {/* INFO SIDEBAR */}
        <div className="watch-info-card">
          <h3>Virtual Try-On Active</h3>
          <p className="info-text">
            Place your hand in front of the camera — the watch will auto-fit in real-time.
          </p>

          <div className="watch-preview">
            <img src={watch.preview} alt={watch.name} />
          </div>

          <p className="tip">AI hand landmark tracking adjusts rotation & size.</p>
        </div>
      </div>

    </div>
  );
};

export default TryOnWatchLive;
