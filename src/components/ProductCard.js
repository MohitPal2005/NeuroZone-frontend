// import React from "react";
// import { useCart } from "../context/CartContext";
// import { ShoppingCart, Zap } from "lucide-react"; // icons for modern look
// import { useNavigate } from "react-router-dom"; 

// const ProductCard = ({ product }) => {
//   const { addToCart, buyNow } = useCart();
//   const navigate = useNavigate(); // ✅ for redirect

//   // ✅ handle Buy Now
//   const handleBuyNow = () => {
//     navigate("/order", { state: { product } }); 
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col justify-between overflow-hidden">
//       {/* Product Image */}
//       <div className="relative group">
//         <img
//           src={product.image}
//           alt={product.title}
//           className="h-56 w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
//         />
//         {/* Discount badge (optional) */}
//         {product.discount && (
//           <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-lg shadow-md">
//             {product.discount}% OFF
//           </span>
//         )}
//       </div>

//       {/* Product Info */}
//       <div className="p-4 flex flex-col flex-grow">
//         <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
//           {product.title}
//         </h3>
//         <p className="text-sm text-gray-500 mt-1">{product.brand || "Brand"}</p>
//         <p className="text-teal-600 font-bold text-xl mt-2">₹{product.price}</p>
//       </div>

//       {/* Buttons */}
//       <div className="flex gap-3 p-4 border-t">
//         <button
//           onClick={() => addToCart(product)}
//           className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition"
//         >
//           <ShoppingCart size={18} /> Add to Cart
//         </button>
//         <button
//           // onClick={() => buyNow(product)}
//           onClick={handleBuyNow}
//           className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
//         >
//           <Zap size={18} /> Buy Now
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
