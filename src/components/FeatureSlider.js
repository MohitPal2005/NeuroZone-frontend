import React from "react";
import Slider from "react-slick";
import "./FeatureSlider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import tryon from "../assets/features/tryon.png"; 
import recommendations from "../assets/features/recommendations.png";
import pricing from "../assets/features/pricing.png"; 
import fraud from "../assets/features/fraud.png"; 
import voice from "../assets/features/voice.png"; 
import chatbot from "../assets/features/chatbot.png";

// Custom next arrow
const SampleNextArrow = ({ className, style, onClick }) => (
  <div
    className={className}
    style={{
      ...style,
      display: "block",
      background: "rgba(0,0,0,0.5)",
      borderRadius: "50%",
      right: "10px",
      zIndex: 10,
    }}
    onClick={onClick}
  />
);

const SamplePrevArrow = ({ className, style, onClick }) => (
  <div
    className={className}
    style={{
      ...style,
      display: "block",
      background: "rgba(0,0,0,0.5)",
      borderRadius: "50%",
      left: "10px",
      zIndex: 10,
    }}
    onClick={onClick}
  />
);

const features = [
  { img: tryon },
  { img: recommendations },
  { img: pricing },
  { img: fraud },
  { img: voice },
  { img: chatbot },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3400,
  arrows: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 1 } },
    { breakpoint: 640, settings: { slidesToShow: 1 } },
  ],
};

const FeatureSlider = () => (
  <section className="section">
    <h2 className="section-title">NeuroZone Features</h2>

    <div className="feature-slider-container">
      <Slider {...sliderSettings}>
        {features.map((f, index) => (
          <div className="feature-slide" key={index}>
            <div className="feature-card">
              <div className="feature-media">
                <img src={f.img} alt={`Feature ${index + 1}`} />
              </div>
              <div className="feature-body">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  </section>
);

export default FeatureSlider;
