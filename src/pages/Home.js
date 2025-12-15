import React from "react";
import ProductCategories from "../components/ProductCategories";
import FeatureSlider from "../components/FeatureSlider";
import PopularProducts from "../components/PopularProducts";

const Home = () => {
  return (
    <>
      {/* Categories */}
      <ProductCategories />

      {/* Feature slider */}
      <FeatureSlider />

      {/* Popular products grid */}
      <PopularProducts />
    </>
  );
};

export default Home;
