import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { format } from "date-fns";
import { Package, FileText } from "lucide-react";
import "./OrdersPage.css";

const PLACEHOLDER = "/placeholder.jpg";

function getImageUrl(image) {
  return image || PLACEHOLDER;
}

function formatINR(value) {
  const n = Number(value);
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR" });
}

const StatusBadge = ({ status }) => {
  const statusClasses = {
    Pending: "status-pending",
    Shipped: "status-shipped",
    Delivered: "status-delivered",
    Cancelled: "status-cancelled",
  };
  const className = statusClasses[status] || "status-default";
  return (
    <span className={`status-badge ${className}`}>
      {status || "Processing"}
    </span>
  );
};

const OrdersPage = () => {
  const { user } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "orders"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(list);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (!user) {
    return (
      <div className="orders-page-container empty-state">
        <h2>Please log in to view your orders</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page-container empty-state">
        <h2>Loading your orders...</h2>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page-container empty-state">
        <h2 className="text-xl font-semibold">📦 No orders yet</h2>
        <p>Your past orders will appear here after you checkout.</p>
      </div>
    );
  }

  return (
    <div className="orders-page-container">
      <h2 className="page-title">My Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div className="header-info">
                <h3>Order #{order.id}</h3>
                <p>
                  Placed on{" "}
                  {order.createdAt?.toDate
                    ? format(order.createdAt.toDate(), "dd MMM, yyyy")
                    : "—"}
                </p>
              </div>
              <div className="header-total">
                <p>Total</p>
                <h3>{formatINR(order.total)}</h3>
              </div>
            </div>

            <div className="order-card-body">
              {order.items?.map((item) => (
                <div key={item.id} className="order-item">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name || "Product"}
                    className="item-image"
                    onError={(e) => (e.target.src = PLACEHOLDER)} // fallback
                  />
                  <div className="item-details">
                    <h4>{item.name || "Product"}</h4>
                    <p>
                      {item.quantity} × {formatINR(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-card-footer">
              <StatusBadge status={order.status} />
              <div className="order-actions">
                <button className="order-action-btn">
                  <FileText size={16} />
                  <span>View Details</span>
                </button>
                <button className="order-action-btn primary">
                  <Package size={16} />
                  <span>Track Order</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
