import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./SearchResults.css";

// const BACKEND_ORIGIN = "https://mohitpal20.pythonanywhere.com";
const BACKEND_ORIGIN = process.env.REACT_APP_BACKEND_URL;
const PLACEHOLDER = "/placeholder.jpg";

function getField(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") {
      return obj[k];
    }
  }
  return null;
}

function getImageUrl(imagePath) {
  if (!imagePath) return PLACEHOLDER;

  if (String(imagePath).startsWith("http")) return imagePath;

  return `${BACKEND_ORIGIN}/${imagePath.replace(/^\//, "")}`;
}

function parsePriceString(val) {
  if (typeof val === "number") return val;
  if (typeof val !== "string") return null;

  const match = val.match(/(\d[\d,]*)/);
  if (!match) return null;

  return Number(match[1].replace(/,/g, ""));
}

function formatINR(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "-";
  return num.toLocaleString("en-IN", { style: "currency", currency: "INR" });
}

function getPriceInfo(product) {
  let current = null;
  let original = null;

  if (product.category === "Mobiles") {
    current = parsePriceString(product["price"]);
    original = current;
  }

  else if (product.category === "Electronics") {
    current = Number(product["price"]);
    original = Number(product["original_price"] || current);
  }

  else if (product.category === "Fashion") {
    current = Number(product["price"]);
    original = Number(product["original_price"] || current);
  }

  let discountPercent = null;
  if (original > current) {
    discountPercent = Math.round(((original - current) / original) * 100);
  }

  return { current, original, discountPercent };
}

function buildSpecs(product) {
  const ram = getField(product, ["ram"]);
  const storage =
    getField(product, ["storage", "rom"]) ||
    (product["model name"] &&
      String(product["model name"]).match(/\d+gb/i)?.[0]);

  const specs = [];
  if (ram) specs.push({ label: "RAM", value: ram });
  if (storage) specs.push({ label: "Storage", value: storage });

  return specs.slice(0, 2);
}

const SearchResults = () => {
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search).get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!queryParam) return setResults([]);
      setLoading(true);

      try {
        const res = await axios.get(
          `${BACKEND_ORIGIN}/search?query=${encodeURIComponent(queryParam)}`
        );
        setResults(Array.isArray(res.data) ? res.data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [queryParam]);

  return (
    <div className="results-container max-w-7xl mx-auto">
      <h2 className="results-heading">
        Search Results for "<span className="results-query">{queryParam}</span>"
      </h2>

      {loading && (
        <div className="results-grid">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="skeleton-card">
              <div className="skeleton-img"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="results-grid">
          {results.map((product, index) => {
            const modelName =
              getField(product, ["model name", "name"]) ||
              `product-${index}`;

            const brand =
              getField(product, ["company name", "brand"]) ||
              "Unknown Brand";

            const { current, original, discountPercent } =
              getPriceInfo(product);

            const specs = buildSpecs(product);

            return (
              <Link
                key={index}
                to={`/product/${encodeURIComponent(modelName)}`}
                className="product-card"
              >
                <img
                  src={getImageUrl(product.image)}
                  alt={modelName}
                  className="product-image"
                  onError={(e) => (e.target.src = PLACEHOLDER)}
                />

                <div className="product-info">
                  <div className="product-title">{modelName}</div>
                  <div className="product-company">{brand}</div>

                  <div className="price-block">
                    <span className="current-price">
                      {formatINR(current)}
                    </span>

                    {original > current && (
                      <>
                        <span className="original-price">
                          {formatINR(original)}
                        </span>
                        <span className="discount-percent">
                          {discountPercent}% off
                        </span>
                      </>
                    )}
                  </div>

                  {specs.length > 0 && (
                    <div className="spec-chip-row">
                      {specs.map((s) => (
                        <span key={s.label} className="spec-chip">
                          {s.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {!loading && results.length === 0 && (
        <p className="no-results-text">No products found.</p>
      )}
    </div>
  );
};

export default SearchResults;
