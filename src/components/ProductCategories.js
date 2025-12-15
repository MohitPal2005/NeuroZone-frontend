import React from "react";
import mobileImg from "../assets/mobile.png";
import laptopImg from "../assets/laptop.png";
import fashionImg from "../assets/fashion.png";
import watchImg from "../assets/watch.png";
import gamesImg from "../assets/games.png";
import accessoriesImg from "../assets/accessories.png";
import "./ProductCategories.css";

const categories = [
  { image: mobileImg, label: "Mobiles" },
  { image: laptopImg, label: "Laptops" },
  { image: fashionImg, label: "Fashion" },
  { image: watchImg, label: "Watches" },
  { image: gamesImg, label: "Games" },
  { image: accessoriesImg, label: "Accessories" },
];

const ProductCategories = () => (
  <div className="product-categories">
    {categories.map((cat, idx) => (
      <div key={idx} className="category-item">
        <div className="category-image">
          <img src={cat.image} alt={cat.label} />
        </div>
        <div className="category-label">{cat.label}</div>
      </div>
    ))}
  </div>
);

export default ProductCategories;
