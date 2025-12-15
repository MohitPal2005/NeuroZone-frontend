import React, { useState } from "react";
import "./Contact.css";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

export default function Contact() {
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("✅ Message sent successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
    e.target.reset();
  };

  return (
    <div className="contact-page">
      <div className="contact-card">
        <div className="contact-left">
          <h2 className="contact-logo">🏢 COMPANY</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" name="name" placeholder="John Doe" required />

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />

            <label>Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Question about pricing"
              required
            />

            <label>Message</label>
            <textarea
              name="message"
              placeholder="Your message..."
              rows="4"
              required
            ></textarea>

            <button type="submit" className="send-btn">
              Send Message
            </button>

            {successMessage && (
              <p className="success-msg">{successMessage}</p>
            )}
          </form>
        </div>

        {/* Right Side - Info */}
        <div className="contact-right">
          <h2 className="contact-title">Get in Touch</h2>
          <p className="contact-subtext">
            We’d love to hear from you. Our team is always here to help.
          </p>

          <div className="contact-info">
            <p>
              <FaEnvelope className="icon" /> mohit799961@gmail.com
            </p>
            <p>
              <FaPhoneAlt className="icon" /> +91 9999999999
            </p>
            <p>
              <FaMapMarkerAlt className="icon" /> India
            </p>
          </div>

          <div className="social-links">
            <a href="https://www.linkedin.com/in/mohit-pal-117430338/" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
            <a href="https://www.instagram.com/mohit_pal_7999/?hl=en" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
