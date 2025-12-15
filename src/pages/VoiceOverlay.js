import React from "react";
import { FaTimes, FaRedo } from "react-icons/fa";
import "./VoiceOverlay.css";

const VoiceOverlay = ({ listening, transcript, error, onClose, onRestart }) => {
  return (
    <div className="voice-overlay">
      <div className="overlay-content">
        <h3>{listening ? "Listening..." : "Voice Search"}</h3>
        {transcript && <p>Heard: "{transcript}"</p>}
        {error && <p className="error">Error: {error}</p>}

        <div className="overlay-buttons">
          <button onClick={onRestart} className="btn restart">
            <FaRedo /> Try Again
          </button>
          <button onClick={onClose} className="btn close">
            <FaTimes /> Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceOverlay;
