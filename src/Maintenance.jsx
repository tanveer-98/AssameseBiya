
import React from "react";
import "./Maintenance.css";

export default function Maintenance() {
  return (
    <main className="maintenance-page">
      <div className="wedding-border wedding-border-top" />

      <section className="maintenance-card">
        <div className="assamese-emblem" aria-hidden="true">
          ❋
        </div>

        <p className="eyebrow">নমস্কাৰ · Namaskar</p>

        <p className="brand-label">ASSAMESE BIYA</p>

        <h1>
          A Little <span>Wedding</span> Magic
          <br />
          Is Coming Soon
        </h1>

        <div className="ornament" aria-hidden="true">
          <span />
          <span className="ornament-diamond">◆</span>
          <span />
        </div>

        <p className="maintenance-message">
          We’re preparing something beautiful to celebrate
          the timeless traditions of Assamese weddings.
        </p>

        <p className="assamese-message">
          আমাৰ ৱেবছাইটটো সজাই তোলা হৈছে
        </p>

        <div className="status-pill">
          <span className="status-dot" />
          Under Maintenance
        </div>

        <p className="return-message">
          We’ll be back soon with something special.
          <br />
          Thank you for your patience.
        </p>

        <div className="wedding-footer">
          <span>Tradition</span>
          <span className="footer-separator">✦</span>
          <span>Culture</span>
          <span className="footer-separator">✦</span>
          <span>Celebration</span>
        </div>
      </section>

      <div className="corner-decoration corner-left" aria-hidden="true">
        ❋
      </div>
      <div className="corner-decoration corner-right" aria-hidden="true">
        ❋
      </div>

      <div className="wedding-border wedding-border-bottom" />
    </main>
  );
}
