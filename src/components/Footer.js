import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer section">
      <div className="container footer__row">
        <div className="col">
          <h4>NeuroZone</h4>
          <p>Shop smarter with AI. Virtual try-on, dynamic pricing, and secure checkout.</p>
        </div>
        <div className="col">
          <h5>Company</h5>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="col">
          <h5>Help</h5>
          <ul>
            <li><a href="/chatbot">Support</a></li>
            <li><a href="/orders">Track Order</a></li>
            <li><a href="/cart">Payments</a></li>
          </ul>
        </div>
      </div>
      <div className="container footnote">
        © {new Date().getFullYear()} NeuroZone. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
