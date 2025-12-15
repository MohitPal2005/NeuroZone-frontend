import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TryOnClothesDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cloth } = location.state || {};

  if (!cloth)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        No cloth selected
      </p>
    );

  return (
    <div
      className="tryon-details-wrapper"
      style={{
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="back-button">
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="tryon-details-card">
        <div className="tryon-details-image">
          <img src={cloth.image} alt={cloth.name} />
        </div>

        <div className="tryon-details-info">
          <h1>{cloth.name}</h1>

          <h2 className="price">₹{cloth.price}</h2>
          <p className="discount">{cloth.discount}</p>

          <p className="desc">
            Experience the perfect fit before buying. Powered by AI-driven
            virtual try-on.
          </p>

          <button
            className="try-btn"
            onClick={() =>
              navigate("/tryon/clothes/live", { state: { cloth } })
            }
          >
            👕 Try On With Camera
          </button>

          <div className="features">
            <h3>Why Try Before You Buy?</h3>
            <ul>
              <li>✔ See how it looks on you in real-time</li>
              <li>✔ Accurate AI body + cloth fitting</li>
              <li>✔ Saves time and reduces returns</li>
              <li>✔ 100% secure & private camera mode</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        /* BUTTON - BACK */
        .back-button {
          position: absolute;
          top: 120px;
          left: 60px;
        }
        .back-button button {
          background: #3b4654;
          color: white;
          padding: 8px 20px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 1rem;
        }
        .back-button button:hover {
          opacity: 0.8;
        }

        /* MAIN CARD */
        .tryon-details-card {
          width: 90%;
          max-width: 1150px;
          display: flex;
          gap: 40px;
          padding: 40px;
          border-radius: 22px;
          box-shadow: 0px 18px 40px rgba(0,0,0,0.15);
          transition: background 0.3s ease;
        }

        /* Light mode */
        body:not(.dark) .tryon-details-card {
          background: #ffffff;
          color: #111;
        }

        /* Dark mode */
        body.dark .tryon-details-card {
          background: #2c3440;
          color: #e8eef6;
        }

        /* LEFT IMAGE */
        .tryon-details-image img {
          width: 330px;
          border-radius: 16px;
          object-fit: cover;
          filter: drop-shadow(0px 10px 25px rgba(0,0,0,0.3));
        }

        /* RIGHT TEXT SIDE */
        .tryon-details-info h1 {
          font-size: 2rem;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .price {
          color: #00b0ff;
          font-size: 1.6rem;
          margin-bottom: 6px;
        }

        .discount {
          color: #22c55e;
          margin-bottom: 20px;
        }

        .desc {
          opacity: 0.8;
          width: 90%;
          margin-bottom: 25px;
        }

        .try-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 10px;
          font-size: 1rem;
          cursor: pointer;
          margin-bottom: 25px;
        }

        .try-btn:hover {
          opacity: 0.9;
        }

        .features h3 {
          font-size: 1.25rem;
          margin-bottom: 10px;
        }

        .features ul {
          list-style: none;
          padding: 0;
        }
        .features li {
          margin-bottom: 8px;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
};

export default TryOnClothesDetails;
