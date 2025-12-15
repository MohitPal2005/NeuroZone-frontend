import React from "react";
import { useNavigate } from "react-router-dom";
import "./GlassesList.css";

const glassesData = [
  {
    id: 1,
    name: "Transparent Glass Trending",
    price: 120,
    rating: 4.2,
    ratingsCount: "1,200 ratings",
    reviewsCount: "50 reviews",
    discount: "20% off",
    images: ["/images/aviator.png", "/images/aviator2.png"],
  },
  {
    id: 2,
    name: "Dark Black Goggle",
    price: 100,
    rating: 4.5,
    ratingsCount: "2,000 ratings",
    reviewsCount: "100 reviews",
    discount: "15% off",
    images: ["/images/round.png", "/images/round2.png"],
  },
  {
    id: 3,
    name: "Red Sunglass",
    price: 150,
    rating: 4.0,
    ratingsCount: "1,500 ratings",
    reviewsCount: "75 reviews",
    discount: "10% off",
    images: ["/images/wayfarer.png", "/images/wayfarer2.png"],
  },
  {
    id: 4,
    name: "Ray-Band Aviator sunglasses",
    price: 200,
    rating: 4.3,
    ratingsCount: "1,800 ratings",
    reviewsCount: "90 reviews",
    discount: "25% off",
    images: ["/images/rayband.png", "/images/rayband2.png"],
  },
  {
    id: 5,
    name: "Golden Framed sunglasses",
    price: 200,
    rating: 4.1,
    ratingsCount: "1,400 ratings",
    reviewsCount: "80 reviews",
    discount: "20% off",
    images: ["/images/gold.png", "/images/gold2.png"],
  },
  {
    id: 6,
    name: "Black Shade",
    price: 100,
    rating: 4.0,
    ratingsCount: "1,000 ratings",
    reviewsCount: "60 reviews",
    discount: "15% off",
    images: ["/images/blackgoggle.png", "/images/blackgoggle2.png"],
  },
  {
    id: 7,
    name: "Glass With Bierd",
    price: 500,
    rating: 4.6,
    ratingsCount: "3,200 ratings",
    reviewsCount: "150 reviews",
    discount: "30% off",
    images: ["/images/face.png", "/images/face2.png"],
  },
  {
    id: 8,
    name: "Sigma Image",
    price: 100,
    rating: 4.0,
    ratingsCount: "950 ratings",
    reviewsCount: "45 reviews",
    discount: "10% off",
    images: ["/images/sigma.png", "/images/sigma2.png"],
  },
  {
    id: 9,
    name: "Beach Framed Goggles",
    price: 250,
    rating: 4.3,
    ratingsCount: "1,300 ratings",
    reviewsCount: "70 reviews",
    discount: "20% off",
    images: ["/images/beach.png", "/images/beach2.png"],
  },
  {
    id: 10,
    name: "Blue Frame Glasses",
    price: 100,
    rating: 4.1,
    ratingsCount: "1,100 ratings",
    reviewsCount: "55 reviews",
    discount: "15% off",
    images: ["/images/blue.png", "/images/blue2.png"],
  },
  {
    id: 11,
    name: "Round glasses",
    price: 90,
    rating: 4.0,
    ratingsCount: "900 ratings",
    reviewsCount: "40 reviews",
    discount: "10% off",
    images: ["/images/circle.png", "/images/circle2.png"],
  },
  {
    id: 12,
    name: "Eye wear Glasses",
    price: 120,
    rating: 4.2,
    ratingsCount: "1,250 ratings",
    reviewsCount: "60 reviews",
    discount: "18% off",
    images: ["/images/eyewear.png", "/images/eyewear2.png"],
  },
  {
    id: 13,
    name: "Fashionable Goggles",
    price: 150,
    rating: 4.3,
    ratingsCount: "1,400 ratings",
    reviewsCount: "75 reviews",
    discount: "20% off",
    images: ["/images/fashion.png", "/images/fashion2.png"],
  },
  {
    id: 14,
    name: "Golden Framed new Style Goggles",
    price: 200,
    rating: 4.4,
    ratingsCount: "1,600 ratings",
    reviewsCount: "85 reviews",
    discount: "25% off",
    images: ["/images/golden.png", "/images/golden2.png"],
  },
  {
    id: 15,
    name: "Green Scenario Goggles",
    price: 100,
    rating: 4.1,
    ratingsCount: "1,050 ratings",
    reviewsCount: "50 reviews",
    discount: "15% off",
    images: ["/images/green.png", "/images/green2.png"],
  },
  {
    id: 16,
    name: "Couples Goggles",
    price: 180,
    rating: 4.5,
    ratingsCount: "2,000 ratings",
    reviewsCount: "100 reviews",
    discount: "30% off",
    images: ["/images/love.png", "/images/love2.png"],
  },
  {
    id: 17,
    name: "Nightwear Frame Glass",
    price: 80,
    rating: 4.0,
    ratingsCount: "850 ratings",
    reviewsCount: "35 reviews",
    discount: "10% off",
    images: ["/images/night.png", "/images/night2.png"],
  },
  {
    id: 18,
    name: "Rectangle Framed Goggles",
    price: 100,
    rating: 4.2,
    ratingsCount: "1,100 ratings",
    reviewsCount: "50 reviews",
    discount: "15% off",
    images: ["/images/rectangle.png", "/images/rectangle2.png"],
  },
  {
    id: 19,
    name: "Snowberg Goggles",
    price: 300,
    rating: 4.6,
    ratingsCount: "2,500 ratings",
    reviewsCount: "120 reviews",
    discount: "35% off",
    images: ["/images/snowberg.png", "/images/snowberg2.png"],
  },
  {
    id: 20,
    name: "Goggles Without Rim framed",
    price: 100,
    rating: 4.1,
    ratingsCount: "1,100 ratings",
    reviewsCount: "55 reviews",
    discount: "15% off",
    images: ["/images/rimless.png", "/images/rimless2.png"],
  },
];

const GlassesList = () => {
  const navigate = useNavigate();

  const handleClick = (glass) => {
    navigate("/tryon/live", { state: { glass } });
  };

  return (
    <div className="glasses-list">
      {glassesData.map((glass) => (
        <div
          key={glass.id}
          className="glass-card"
          onClick={() => handleClick(glass)}
        >
          <img
            src={glass.images[0]}
            alt={glass.name}
            onMouseOver={(e) =>
              (e.currentTarget.src = glass.images[1] || glass.images[0])
            }
            onMouseOut={(e) => (e.currentTarget.src = glass.images[0])}
          />
          <h3>{glass.name}</h3>
          <p>₹{glass.price}</p>
          <p>⭐ {glass.rating} ({glass.ratingsCount})</p>
          <p>{glass.reviewsCount}</p>
          <p>{glass.discount}</p>
        </div>
      ))}
    </div>
  );
};

export default GlassesList;
