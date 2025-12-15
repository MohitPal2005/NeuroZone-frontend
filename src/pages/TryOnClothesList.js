import React from "react";
import { useNavigate } from "react-router-dom";
import shirt1 from "../assets/shirts/shirt1.png";
import shirt2 from "../assets/shirts/shirt2.png";
import shirt3 from "../assets/shirts/shirt3.png";
import shirt4 from "../assets/shirts/shirt4.png";
import shirt5 from "../assets/shirts/shirt5.png";
import shirt6 from "../assets/shirts/shirt6.png";
import shirt7 from "../assets/shirts/shirt7.png";
import shirt8 from "../assets/shirts/shirt8.png";
import shirt9 from "../assets/shirts/shirt9.png";
import shirt10 from "../assets/shirts/shirt10.png";
import shirt11 from "../assets/shirts/shirt11.png";
import shirt12 from "../assets/shirts/shirt12.png";
import shirt13 from "../assets/shirts/shirt13.png";
import shirt14 from "../assets/shirts/shirt14.png";

const clothesData = [
  { id: 1, name: "Black T-shirt", price: 120, image: shirt1, discount: "10% off" },
  { id: 2, name: "Black Coat", price: 100, image: shirt2, discount: "5% off" },
  { id: 3, name: "Blue design Mens Shirt", price: 900, image: shirt3, discount: "15% off" },
  { id: 4, name: "Men's Polo Red T-shirt", price: 850, image: shirt4, discount: "10% off" },
  { id: 5, name: "Blach Hoddie", price: 1200, image: shirt5, discount: "20% off" },
  { id: 6, name: "Gray Formal Coat", price: 1300, image: shirt6, discount: "5% off" },
  { id: 7, name: "Black Court", price: 700, image: shirt7, discount: "15% off" },
  { id: 8, name: "White Shirt", price: 950, image: shirt8, discount: "10% off" },
  { id: 9, name: "Black Jacket", price: 1100, image: shirt9, discount: "12% off" },
  { id: 10, name: "Women's Kurti", price: 1500, image: shirt10, discount: "18% off" },
  { id: 11, name: "Women's Top", price: 1400, image: shirt11, discount: "20% off" },
  { id: 12, name: "Women Red coat", price: 800, image: shirt12, discount: "5% off" },
  { id: 13, name: "Blue Polo T-Shirt", price: 1250, image: shirt13, discount: "10% off" },
  { id: 14, name: "Leather Jacket", price: 1000, image: shirt14, discount: "15% off" },
];

const TryOnClothesList = () => {
  const navigate = useNavigate();

  const handleClick = (cloth) => {
    navigate(`/tryon/clothes/${cloth.id}`, { state: { cloth } });
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      {clothesData.map((cloth) => (
        <div
          key={cloth.id}
          style={cardStyle}
          onClick={() => handleClick(cloth)}
        >
          <img
            src={cloth.image}
            alt={cloth.name}
            style={{ width: "100%", borderRadius: "5px" }}
          />
          <h4>{cloth.name}</h4>
          <p>₹{cloth.price}</p>
          <p>{cloth.discount}</p>
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
  hover: {
    transform: "scale(1.05)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
};

export default TryOnClothesList;

