import React from "react";
import { useNavigate } from "react-router-dom";
import "./TryOnWatchList.css";

import watch1 from "../assets/watches/watch1.png";
import watch1_preview from "../assets/watches/watch1_preview.png";

import watch2 from "../assets/watches/watch2.png";
import watch2_preview from "../assets/watches/watch2_preview.png";

import watch3 from "../assets/watches/watch3.png";
import watch3_preview from "../assets/watches/watch3_preview.png";

import watch4 from "../assets/watches/watch4.png";
import watch4_preview from "../assets/watches/watch4_preview.png";

import watch5 from "../assets/watches/watch5.png";
import watch5_preview from "../assets/watches/watch5_preview.png";

import watch6 from "../assets/watches/watch6.png";
import watch6_preview from "../assets/watches/watch6_preview.png";

import watch7 from "../assets/watches/watch7.png";
import watch7_preview from "../assets/watches/watch7_preview.png";

import watch8 from "../assets/watches/watch8.png";
import watch8_preview from "../assets/watches/watch8_preview.png";

import watch9 from "../assets/watches/watch9.png";
import watch9_preview from "../assets/watches/watch9_preview.png";


const watches = [
  { id: 1, preview: watch1_preview, raw: watch1, name: "Classic Watch" },
  { id: 2, preview: watch2_preview, raw: watch2, name: "Sport Watch" },
  { id: 3, preview: watch3_preview, raw: watch3, name: "Metal Analog Watch" },
  { id: 4, preview: watch4_preview, raw: watch4, name: "Black Analog Design" },
  { id: 5, preview: watch5_preview, raw: watch5, name: "Black Band Design" },
  { id: 6, preview: watch6_preview, raw: watch6, name: "Analog Watch" },
  { id: 7, preview: watch7_preview, raw: watch7, name: "Digital Watch" },
  { id: 8, preview: watch8_preview, raw: watch8, name: "Digital Watch with New Features" },
  { id: 9, preview: watch9_preview, raw: watch9, name: "Blue Analog Watch" }
];

const TryOnWatchList = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        marginTop: "40px",
      }}
    >
      {watches.map((watch) => (
        <div
          key={watch.id}
          style={cardStyle}
          onClick={() => navigate("/tryon/watches/live", { state: { watch, selectedWatch: watch.raw } })}
        >
          <img src={watch.preview} alt={watch.name} className="watch-display" />
          <h4>{watch.name}</h4>
        </div>
      ))}
    </div>
  );
};

const cardStyle = {
  width: "180px",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  textAlign: "center",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
};

export default TryOnWatchList;
