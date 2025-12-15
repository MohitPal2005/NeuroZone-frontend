import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { getUserCoupons, applyCoupon } from "../utils/firestore";
import { auth } from "../firebase";

const PLACEHOLDER = "/placeholder.jpg";

function getImageUrl(image) {
  return image || PLACEHOLDER;
}

function formatINR(value) {
  const n = Number(value);
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR" });
}

const QuantityControl = ({ itemId, quantity, onchange, loading }) => (
  <div className="quantity-control">
    <button
      onClick={() => onchange(itemId, quantity - 1)}
      disabled={loading || quantity <= 1}
      className="quantity-btn"
    >-</button>
    <span>{quantity}</span>
    <button
      onClick={() => onchange(itemId, quantity + 1)}
      disabled={loading}
      className="quantity-btn"
    >+</button>
  </div>
);

const CartPage = () => {
  const { cart = [], updateQuantity, removeFromCart, checkout } = useCart();
  const navigate = useNavigate();

  const [loadingItems, setLoadingItems] = useState({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await getUserCoupons();
        const unused = data.filter(c => !c.used);
        setCoupons(unused);
      } catch (err) {
        console.error("Failed to fetch coupons", err);
      }
    };
    fetchCoupons();
  }, []);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0),
    [cart]
  );

  const totalAfterDiscount = useMemo(() => total - (total * discount) / 100, [total, discount]);

  const handleChangeQty = async (itemId, newQty) => {
    if (loadingItems[itemId] || newQty <= 0) return;
    setLoadingItems((s) => ({ ...s, [itemId]: true }));
    try { await updateQuantity(itemId, newQty); } 
    catch { toast.error("Failed to update quantity"); } 
    finally { setLoadingItems((s) => ({ ...s, [itemId]: false })); }
  };

  const handleRemove = async (itemId) => {
    if (loadingItems[itemId]) return;
    setLoadingItems((s) => ({ ...s, [itemId]: true }));
    try { await removeFromCart(itemId); toast.success("Removed from cart"); } 
    catch { toast.error("Failed to remove item"); } 
    finally { setLoadingItems((s) => ({ ...s, [itemId]: false })); }
  };

  const handleApplyCoupon = async (coupon) => {
    try {
      if (!coupon) return;
      setDiscount(Number(coupon.value) || 0);
      setSelectedCoupon(coupon);
      await applyCoupon(coupon.id); 
      setCoupons(prev => prev.filter(c => c.id !== coupon.id));
      toast.success(`Coupon ${coupon.code} applied!`);
    } catch (err) { console.error(err); toast.error("Failed to apply coupon"); }
  };

  const handleCheckout = async () => {
    if (checkoutLoading) return;
    setCheckoutLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const orderData = {
        appliedCoupon: selectedCoupon?.code || null,
        discount: discount || 0,
        total: totalAfterDiscount,
      };

      const res = await checkout(orderData);  
      if (res?.ok) {
        toast.success("Order placed successfully!");
        setSelectedCoupon(null);
        navigate("/orders");
      } else {
        toast.error(res?.error || "Checkout failed");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Checkout failed. Try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="p-6 text-center h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-3xl font-semibold mb-2">🛒</h2>
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="btn mt-6">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
      <div className="cart-layout">
        <div className="cart-items-list">
          {cart.map((item) => (
            <div key={item.id} className="cart-item-card">
              <img src={getImageUrl(item.image)} alt={item.name} className="cart-item-image"/>
              <div className="cart-item-details">
                <h3 className="font-semibold text-base md:text-lg line-clamp-2">{item.name}</h3>
              </div>
              <div className="cart-item-quantity">
                <QuantityControl itemId={item.id} quantity={Number(item.quantity)} onchange={handleChangeQty} loading={loadingItems[item.id]}/>
              </div>
              <div className="cart-item-price">
                <p className="font-bold text-lg">{formatINR(Number(item.price) * Number(item.quantity))}</p>
              </div>
              <div className="cart-item-remove">
                <button onClick={() => handleRemove(item.id)} disabled={loadingItems[item.id]} className="remove-btn"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary-card">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span className="font-semibold">{formatINR(total)}</span></div>
          <div className="summary-row mt-4 flex flex-col gap-2">
            <span className="font-semibold">Available Coupons:</span>
            {coupons.length === 0 && <span className="text-muted">No coupons available</span>}
            {coupons.map(c => (
              <button key={c.id} onClick={() => handleApplyCoupon(c)} className="btn-coupon" disabled={selectedCoupon?.id === c.id}>
                {c.code} - {c.value}%
                {selectedCoupon?.id === c.id && " (Applied)"}
              </button>
            ))}
          </div>
          <div className="summary-row total-row mt-2">
            <span>Total after discount</span>
            <span className="font-bold text-xl">{formatINR(totalAfterDiscount)}</span>
          </div>
          <button onClick={handleCheckout} disabled={checkoutLoading} className="btn-checkout w-full mt-4">
            {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
