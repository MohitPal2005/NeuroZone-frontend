import React from "react";
import iphone16 from "../assets/products/iphone16.png";
import samsung25 from "../assets/products/samsung25.png";
import pixel10 from "../assets/products/pixel10.png";
import oneplus13 from "../assets/products/oneplus13.png";
import nothing3a from "../assets/products/nothing3a.png";
import flip7 from "../assets/products/flip7.png";
import applewatch10 from "../assets/products/applewatch10.png";
import watch8 from "../assets/products/watch8.png";
import pixelwatch3 from "../assets/products/pixelwatch3.png";
import garminx1 from "../assets/products/garminx1.png";
import sonywh1000 from "../assets/products/sonywh1000.png";
import boseqc from "../assets/products/boseqc.png";
import ankerspace from "../assets/products/ankerspace.png";
import dysonhead from "../assets/products/dysonhead.png";
import airpods3 from "../assets/products/airpods3.png";
import macairm4 from "../assets/products/macairm4.png";
import zenbook14 from "../assets/products/zenbook14.png";
import acerswift14 from "../assets/products/acerswift14.png";
import msiraider from "../assets/products/msiraider.png";
import dellxps13 from "../assets/products/dellxps13.png";
import "./PopularProducts.css";
import { useCart } from "../context/CartContext";

const products = [
  { id: 1, name: "iPhone 16 Pro Max", price: 1199, img: iphone16, rating: 4.8 },
  { id: 2, name: "Samsung Galaxy S25 Ultra", price: 1399, img: samsung25, rating: 4.7 },
  { id: 3, name: "Google Pixel 10 Pro", price: 899, img: pixel10, rating: 4.6 },
  { id: 4, name: "OnePlus 13", price: 799, img: oneplus13, rating: 4.5 },
  { id: 5, name: "Nothing Phone 3a Pro", price: 499, img: nothing3a, rating: 4.4 },
  { id: 6, name: "Samsung Galaxy Z Flip 7", price: 1199, img: flip7, rating: 4.3 },
  { id: 7, name: "Apple Watch Series 10", price: 399, img: applewatch10, rating: 4.8 },
  { id: 8, name: "Samsung Galaxy Watch 8", price: 349, img: watch8, rating: 4.7 },
  { id: 9, name: "Google Pixel Watch 3", price: 349, img: pixelwatch3, rating: 4.6 },
  { id: 10, name: "Garmin Venu X1", price: 299, img: garminx1, rating: 4.5 },
  { id: 11, name: "Sony WH-1000XM6", price: 449, img: sonywh1000, rating: 4.9 },
  { id: 12, name: "Bose QuietComfort Ultra", price: 399, img: boseqc, rating: 4.8 },
  { id: 13, name: "Anker Soundcore Space One", price: 199, img: ankerspace, rating: 4.7 },
  { id: 14, name: "Dyson OnTrac Headphones", price: 319, img: dysonhead, rating: 4.6 },
  { id: 15, name: "Apple AirPods Pro 3", price: 329, img: airpods3, rating: 4.5 },
  { id: 16, name: "MacBook Air M4", price: 1099, img: macairm4, rating: 4.9 },
  { id: 17, name: "Asus Zenbook 14 OLED", price: 849, img: zenbook14, rating: 4.8 },
  { id: 18, name: "Acer Swift Go 14", price: 749, img: acerswift14, rating: 4.7 },
  { id: 19, name: "MSI Raider 18 HX AI", price: 2499, img: msiraider, rating: 4.6 },
  { id: 20, name: "Dell XPS 13 9345", price: 1299, img: dellxps13, rating: 4.5 }
];

const formatPrice = (n) =>
  n.toLocaleString("en-IN", { style: "currency", currency: "INR" });

const PopularProducts = () => {
  const { addToCart, buyNow } = useCart();

  return (
    <section className="popular-products">
      <div className="container">
        <h2 className="section-title">Popular Products</h2>

        <div className="products-grid">
          {products.map((p) => (
            <article className="product-card" key={p.id}>
              <div className="product-media">
                <img src={p.img} alt={p.name} />
              </div>
              <div className="product-body">
                <h3 className="product-title">{p.name}</h3>
                <div className="product-meta">
                  <span className="price">{formatPrice(p.price)}</span>
                  <span className="rating">★ {p.rating}</span>
                </div>
                <button
                  className="btn add"
                  onClick={() => {
                    addToCart(p);
                    alert(`${p.name} added to cart!`);
                  }}
                >
                  Add to Cart
                </button>

                <button
                  className="btn buy"
                  onClick={() => {
                    buyNow(p);
                    alert(`Purchased ${p.name} successfully!`);
                  }}
                >
                  Buy Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
