import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { ShoppingCart, Zap, Star } from "lucide-react";
import styled, { createGlobalStyle } from "styled-components";

// const BACKEND_ORIGIN = "https://mohitpal20.pythonanywhere.com";
const BACKEND_ORIGIN = process.env.REACT_APP_BACKEND_URL
const PLACEHOLDER = "/placeholder.jpg";

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) =>
      props.themeMode === "dark" ? "#020617" : "#f3f4f6"};
    color: ${(props) =>
      props.themeMode === "dark" ? "#f9fafb" : "#111827"};
    transition: background-color 0.25s ease, color 0.25s ease;
  }
`;


const PageWrapper = styled.div`
  padding: 2rem 1rem;
`;

const ProductContainer = styled.div`
  max-width: 78rem;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${(props) =>
    props.themeMode === "dark" ? "#0b1120" : "#ffffff"};
  border-radius: 1rem;
  border: 1px solid
    ${(props) => (props.themeMode === "dark" ? "#1f2937" : "#e5e7eb")};
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
`;

const Grid = styled.div`
  display: grid;
  gap: 2.5rem;

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.2fr);
  }
`;

const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border: 1px solid
    ${(props) => (props.themeMode === "dark" ? "#1f2937" : "#e5e7eb")};
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: ${(props) =>
    props.themeMode === "dark"
      ? "radial-gradient(circle at top, #020617, #020617 70%)"
      : "#f9fafb"};
`;

const MainImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: 0.25s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
`;

const ThumbnailGrid = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Thumbnail = styled.div`
  width: 4rem;
  height: 4rem;
  padding: 0.25rem;
  border: 2px solid
    ${(props) =>
      props.isActive
        ? "#3b82f6"
        : props.themeMode === "dark"
        ? "#475569"
        : "#d1d5db"};
  border-radius: 0.5rem;
  cursor: pointer;
  background: ${(props) =>
    props.themeMode === "dark" ? "#020617" : "#ffffff"};
  transition: 0.2s;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:hover {
    border-color: #3b82f6;
  }
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  color: ${(props) => (props.themeMode === "dark" ? "#a1a1aa" : "#4b5563")};
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
`;

const RatingBadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.5rem 0 1rem 0;
`;

const RatingChip = styled.span`
  display: inline-flex;
  align-items: center;
  background: #16a34a;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 0.4rem;
  font-size: 0.78rem;
  font-weight: 600;
`;

const RatingText = styled.span`
  font-size: 0.88rem;
  color: ${(props) => (props.themeMode === "dark" ? "#a1a1aa" : "#4b5563")};
`;

const PriceRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
  margin-bottom: 0.25rem;
`;

const Price = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ef4444;
`;

const MRPText = styled.span`
  text-decoration: line-through;
  color: #6b7280;
  font-size: 0.95rem;
`;

const OfferTag = styled.div`
  color: #16a34a;
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
`;

const AboutTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const DescriptionList = styled.ul`
  list-style: disc;
  padding-left: 1.25rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  color: ${(props) => (props.themeMode === "dark" ? "#e5e7eb" : "#475569")};

  li {
    margin-bottom: 0.35rem;
  }
`;

const SpecsWrapper = styled.div`
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid
    ${(props) => (props.themeMode === "dark" ? "#1f2937" : "#e5e7eb")};
`;

const SpecsTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const SpecsTable = styled.div`
  display: grid;
  grid-template-columns: 0.4fr 0.6fr;
  column-gap: 1.5rem;
  row-gap: 0.2rem;
  font-size: 0.9rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SpecsKey = styled.div`
  font-weight: 600;
  color: ${(props) => (props.themeMode === "dark" ? "#d4d4d8" : "#374151")};
`;

const SpecsValue = styled.div`
  color: ${(props) => (props.themeMode === "dark" ? "#e5e7eb" : "#4b5563")};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.9rem;
  border-radius: 0.6rem;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const AddToCartButton = styled(ActionButton)`
  background: #fbbf24;
  color: #1f2937;

  &:hover {
    background: #f59e0b;
  }
`;

const BuyNowButton = styled(ActionButton)`
  background: #f97316;
  color: white;

  &:hover {
    background: #ea580c;
  }
`;


const fields = {
  name: [
    "model name",
    "Model Name",
    "product_name",
    "productDisplayName",
    "name",
    "title",
  ],
  brand: ["company name", "Company Name", "Brand", "brand", "company"],
};

function getField(product, keys) {
  for (const k of keys) {
    if (product && product[k] !== undefined && product[k] !== null) {
      const text = String(product[k]).trim();
      if (text && text !== "No rating available") return text;
    }
  }
  return null;
}

function getImageUrl(image) {
  if (!image) return PLACEHOLDER;
  if (String(image).startsWith("http")) return image;
  return `${BACKEND_ORIGIN}/${image.replace(/^\//, "")}`;
}

function parseINRPrice(val) {
  if (typeof val === "number") return val;
  if (typeof val !== "string") return 0;
  const match = val.match(/(\d[\d,]*)/);
  if (!match) return 0;
  return Number(match[1].replace(/,/g, ""));
}

function buildHighlightPoints(product) {
  const highlights = [];
  const category = product.category;
  const title = getField(product, fields.name);
  const brand = getField(product, fields.brand);

  if (category === "Mobiles") {
    const ram = product.ram;
    const model = getField(product, fields.name) || "";
    const storageMatch = model.match(/\b(\d+GB)\b/i);
    const storage = storageMatch ? storageMatch[1].toUpperCase() : null;
    const processor = product.processor;
    const screen = product["screen size"];
    const battery = product["battery capacity"];

    if (ram || storage) {
      const parts = [];
      if (ram) parts.push(`${ram} RAM`);
      if (storage) parts.push(`${storage} Storage`);
      highlights.push(parts.join(" • "));
    }
    if (processor) highlights.push(`Processor: ${processor}`);
    if (screen) highlights.push(`Display: ${screen}`);
    if (battery) highlights.push(`Battery: ${battery}`);
  } else if (category === "Electronics") {
    const desc = product.description || "";
    if (desc) {
      const parts = desc
        .split(/[•\n]|(?<=\.)\s+/)
        .map((x) => x.trim())
        .filter(Boolean);
      highlights.push(...parts.slice(0, 5));
    }
  } else if (category === "Fashion") {
    if (title || brand) {
      highlights.push(`${brand || ""} ${title || ""}`.trim());
    }
    highlights.push(`Category: ${category || "Fashion"}`);
  }

  if (!highlights.length && title) {
    highlights.push(title);
  }

  return highlights.slice(0, 6);
}

function buildSpecsSections(product) {
  const sections = [];
  const category = product.category;
  const title = getField(product, fields.name);
  const brand = getField(product, fields.brand);
  const cat = product.category || "General";

  const generalRows = [
    ["Brand", brand || "-"],
    ["Model Name", title || "-"],
    ["Category", cat],
  ];
  sections.push({ title: "General", rows: generalRows });

  if (category === "Mobiles") {
    const displayRows = [];
    if (product["screen size"]) {
      displayRows.push(["Screen Size", product["screen size"]]);
    }
    if (product.processor) {
      displayRows.push(["Processor", product.processor]);
    }
    if (displayRows.length) {
      sections.push({ title: "Display & Performance", rows: displayRows });
    }

    const batteryRows = [];
    if (product["battery capacity"]) {
      batteryRows.push(["Battery Capacity", product["battery capacity"]]);
    }
    if (batteryRows.length) {
      sections.push({ title: "Battery", rows: batteryRows });
    }
  } else if (category === "Electronics") {
    const detailRows = [];
    if (product.description) {
      detailRows.push(["Details", product.description]);
    }
    if (detailRows.length) {
      sections.push({ title: "Product Details", rows: detailRows });
    }
  } else if (category === "Fashion") {
    const fashionRows = [];
    if (title) fashionRows.push(["Product", title]);
    if (brand) fashionRows.push(["Brand", brand]);
    fashionRows.push(["Category", cat]);
    sections.push({ title: "Product Details", rows: fashionRows });
  }

  return sections;
}


const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, buyNow } = useCart();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [themeMode, setThemeMode] = useState(
    document.body.classList.contains("dark") ? "dark" : "light"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setThemeMode(document.body.classList.contains("dark") ? "dark" : "light");
    });

    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const decoded = decodeURIComponent(id);
        const res = await axios.get(
          `${BACKEND_ORIGIN}/product?name=${encodeURIComponent(decoded)}`
        );

        if (!res.data || res.data.error) {
          setProduct(null);
        } else {
          const p = res.data;
          setProduct(p);

          const imgArray = (p.images || [p.image]).map(getImageUrl).slice(0, 3);

          setImages(imgArray);
          setMainImage(imgArray[0] || PLACEHOLDER);
        }
      } catch (e) {
        console.error(e);
      }

      setLoading(false);
    };

    load();
  }, [id]);

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "2rem" }}>Loading product...</p>
    );
  if (!product)
    return (
      <p style={{ textAlign: "center", padding: "2rem" }}>
        Product not found.
      </p>
    );

  const title = getField(product, fields.name);
  const brand = getField(product, fields.brand) || "Unknown Brand";
  const category = product.category || "General";

  let price = 0;
  let mrp = 0;

  if (category === "Mobiles") {
    price = parseINRPrice(product.price);
    mrp = price;
  } else {
    price = Number(product.price || 0);
    const possibleMrp =
      product.original_price || product.mrp || product.retail_price;
    mrp = possibleMrp ? Number(possibleMrp) : price;
  }

  const rating = Number(product.rating || 4.5);
  const ratingCount = product.ratingCount || "10,000+";

  const highlights = buildHighlightPoints(product);
  const specsSections = buildSpecsSections(product);

  const doAddToCart = async () => {
    const fixedImage = getImageUrl(product.image);
    const fixedImages = (product.images || []).map(getImageUrl);

    const cleanProduct = {
      ...product,
      price,
      image: fixedImage,
      images: fixedImages
    };

    await addToCart(cleanProduct);
    toast.success(`${title} added to cart!`);
  };

  const doBuyNow = async () => {
    const fixedImage = getImageUrl(product.image);
    const fixedImages = (product.images || []).map(getImageUrl);

    await buyNow({
      ...product,
      price,
      image: fixedImage,
      images: fixedImages
    });

    toast.success(`Purchased ${title}!`);
  };


  
  return (
    <>
      <GlobalStyle themeMode={themeMode} />

      <PageWrapper>
        <ProductContainer themeMode={themeMode}>
          <Grid>
            <ImageGallery>
              <MainImageContainer themeMode={themeMode}>
                <MainImage src={mainImage} alt={title} />
              </MainImageContainer>

              <ThumbnailGrid>
                {images.map((img, idx) => (
                  <Thumbnail
                    key={idx}
                    isActive={img === mainImage}
                    onMouseEnter={() => setMainImage(img)}
                    themeMode={themeMode}
                  >
                    <img src={img} alt="thumbnail" />
                  </Thumbnail>
                ))}
              </ThumbnailGrid>
            </ImageGallery>

            <InfoColumn>
              <Title>{title}</Title>

              <MetaInfo themeMode={themeMode}>
                <span>
                  <strong>Brand:</strong> {brand}
                </span>
                <span>
                  <strong>Category:</strong> {category}
                </span>
              </MetaInfo>

              <RatingBadgeRow>
                <RatingChip>{rating.toFixed(1)} ★</RatingChip>
                <RatingText themeMode={themeMode}>
                  {ratingCount} Ratings &amp; Reviews
                </RatingText>
              </RatingBadgeRow>

              <div style={{ marginBottom: "0.75rem" }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.round(rating) ? "currentColor" : "none"}
                    style={{ color: "#fbbf24" }}
                  />
                ))}
              </div>

              <PriceRow>
                <Price>₹{price.toLocaleString("en-IN")}</Price>
                {mrp > price && (
                  <MRPText>₹{mrp.toLocaleString("en-IN")}</MRPText>
                )}
              </PriceRow>

              <OfferTag>
                Inclusive of all taxes • Special price & bank offers available*
              </OfferTag>

              <AboutTitle>About this item</AboutTitle>
              <DescriptionList themeMode={themeMode}>
                {highlights.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </DescriptionList>

              <SpecsWrapper themeMode={themeMode}>
                <SpecsTitle>Specifications</SpecsTitle>
                {specsSections.map((section, idx) => (
                  <div key={idx} style={{ marginBottom: "0.5rem" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.92rem",
                        marginBottom: "0.15rem",
                      }}
                    >
                      {section.title}
                    </div>
                    <SpecsTable>
                      {section.rows.map(([k, v], i) => (
                        <React.Fragment key={i}>
                          <SpecsKey themeMode={themeMode}>{k}</SpecsKey>
                          <SpecsValue themeMode={themeMode}>{v}</SpecsValue>
                        </React.Fragment>
                      ))}
                    </SpecsTable>
                  </div>
                ))}
              </SpecsWrapper>

              <ActionButtons>
                <AddToCartButton onClick={doAddToCart}>
                  <ShoppingCart size={20} /> Add to Cart
                </AddToCartButton>

                <BuyNowButton onClick={doBuyNow}>
                  <Zap size={20} /> Buy Now
                </BuyNowButton>
              </ActionButtons>
            </InfoColumn>
          </Grid>
        </ProductContainer>
      </PageWrapper>
    </>
  );
};

export default ProductDetails;
