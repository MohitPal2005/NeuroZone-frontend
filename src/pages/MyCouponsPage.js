import React, { useEffect, useState } from "react";
import { getUserCoupons } from "../utils/firestore";

import './MyCouponsPage.css';

import { GiPresent } from "react-icons/gi";
import { FaPercentage, FaStar, FaShoppingCart } from "react-icons/fa";

const MyCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const allCoupons = await getUserCoupons();
        const unused = allCoupons.filter(c => !c.used);
        setCoupons(unused);
      } catch (err) {
        console.error("Failed to fetch coupons", err);
      }
    };
    fetchCoupons();
  }, []);

  const handleRedeemCoupon = (couponId) => {
    setCoupons(currentCoupons =>
      currentCoupons.filter(coupon => coupon.id !== couponId)
    );
    console.log(`Redeemed coupon with ID: ${couponId}`);
  };

  const getCouponIcon = (code) => {
    const upperCaseCode = code.toUpperCase();
    const iconClassName = "text-gray-300 text-3xl";

    if (upperCaseCode.includes("QUIZ")) {
      return <FaPercentage className={iconClassName} />;
    }
    if (upperCaseCode.includes("SCRATCH")) {
      return <FaStar className={iconClassName} />;
    }
    return <FaShoppingCart className={iconClassName} />;
  };

  return (
    <div className="coupons-page">
      <h2 className="coupons-title">My Coupons</h2>
      <GiPresent className="coupons-icon" />

      {coupons.length === 0 ? (
        <p className="no-coupons-message">You don't have any available coupons right now.</p>
      ) : (
        <div className="coupons-grid">
          {coupons.map(coupon => (
            <div key={coupon.id} className="coupon-card">
              <div className="card-content">
                <h3 className="card-code">{coupon.code}</h3>
                <p className="card-discount">Discount: {coupon.value}%</p>
                <button
                  className="card-button"
                  onClick={() => handleRedeemCoupon(coupon.id)}
                >
                  Redeem
                </button>
              </div>
              <div>{getCouponIcon(coupon.code)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCouponsPage;