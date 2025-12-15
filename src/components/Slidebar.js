// import React from "react";
// import Slider from "react-slick";
// import "./Slidebar.css";

// const features = [
//   {
//     title: "Virtual Try-On",
//     img: "https://picsum.photos/seed/tryon/500/300",
//     desc: "Experience products before buying."
//   },
//   {
//     title: "Product Recommendation",
//     img: "https://picsum.photos/seed/recommendation/500/300",
//     desc: "Smart AI suggestions tailored for you."
//   },
//   {
//     title: "Voice Search",
//     img: "https://picsum.photos/seed/voice/500/300",
//     desc: "Find products hands-free."
//   },
//   {
//     title: "Fraud Detection",
//     img: "https://picsum.photos/seed/fraud/500/300",
//     desc: "Secure transactions with AI monitoring."
//   },
//   {
//     title: "Fake Reviews",
//     img: "https://picsum.photos/seed/reviews/500/300",
//     desc: "Detect and remove spam reviews."
//   },
//   {
//     title: "AI Chatbot",
//     img: "https://picsum.photos/seed/chatbot/500/300",
//     desc: "24/7 customer assistance."
//   },
//   {
//     title: "Game / Discount",
//     img: "https://picsum.photos/seed/game/500/300",
//     desc: "Play games to win rewards."
//   }
// ];

// const Slidebar = () => {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     responsive: [
//       { breakpoint: 1024, settings: { slidesToShow: 2 } },
//       { breakpoint: 600, settings: { slidesToShow: 1 } }
//     ]
//   };

//   return (
//     <div className="feature-slider">
//       <Slider {...settings}>
//         {features.map((feature, index) => (
//           <div className="feature-card" key={index}>
//             <img src={feature.img} alt={feature.title} />
//             <h3>{feature.title}</h3>
//             <p>{feature.desc}</p>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default Slidebar;
