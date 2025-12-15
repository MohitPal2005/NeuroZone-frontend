import React from "react";
import { useNavigate } from "react-router-dom";
import { productsData } from "../data/ProductData";

const ProductList = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", marginTop: "50px" }}>
      {productsData.map((product) => (
        <div
          key={product.id}
          style={cardStyle}
          onClick={() => navigate(`/tryon/product/${product.id}`, { state: { product } })}
        >
          <h3>{product.name}</h3>
          <p>₹{product.price}</p>
        </div>
      ))}
    </div>
  );
};

const cardStyle = {
  width: "200px",
  height: "150px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexDirection: "column",
};

export default ProductList;
