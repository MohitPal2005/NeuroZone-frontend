// src/components/GameCard.js
import React from "react";

const GameCard = ({ title, onClick }) => {
  return (
    <div 
      className="game-card" 
      onClick={onClick} 
      style={{
        border: "2px solid #00c8c8",
        borderRadius: "12px",
        padding: "20px",
        margin: "10px",
        cursor: "pointer",
        width: "200px",
        textAlign: "center",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
    >
      <h2>{title}</h2>
    </div>
  );
};

export default GameCard;
