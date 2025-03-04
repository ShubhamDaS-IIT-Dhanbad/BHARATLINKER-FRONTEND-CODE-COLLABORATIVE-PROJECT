import React from 'react';

const hl1 = "https://res.cloudinary.com/demc9mecm/image/upload/v1741102459/hl1_xhdy7o.png";
const hsp1 = "https://res.cloudinary.com/demc9mecm/image/upload/v1741102460/hs1_dmdchj.png";
const hss1 = "https://res.cloudinary.com/demc9mecm/image/upload/v1741102460/hss1_eje5nx.png";
const hpp1 = "https://res.cloudinary.com/demc9mecm/image/upload/v1741102459/hpp1_sktbtj.jpg";
const hc1 = "https://res.cloudinary.com/demc9mecm/image/upload/v1741102458/hc1_kzvl0m.avif";

function HowItWorks() {
  return (
    <div className="how-it-works-container">
      <p>HOW IT WORKS</p>
      <div className="steps-container">
        <div className="step-card">
          <img
            src={hl1}
            style={{ height: "90%" }}
            alt="Select location"
            className="step-icon"
            loading="lazy" // Native lazy loading
          />
          <div className="step-card-1">
            <div className="step-card-1-1">Select Your Location</div>
            <div className="step-card-1-2">
              Choose the location where you want to search. You can also adjust the radius of your search from the selected location to refine your results.
            </div>
          </div>
        </div>
        <div className="step-card">
          <img
            src={hsp1}
            style={{ height: "90%" }}
            alt="Search products"
            className="step-icon"
            loading="lazy"
          />
          <div className="step-card-1">
            <div className="step-card-1-1">Search for Products</div>
            <div className="step-card-1-2">
              Easily find the products you need by searching our extensive catalog. Search by name or category to quickly locate your desired items.
            </div>
          </div>
        </div>
        <div className="step-card">
          <img
            src={hss1}
            style={{ height: "90%" }}
            alt="Search shops"
            className="step-icon"
            loading="lazy"
          />
          <div className="step-card-1">
            <div className="step-card-1-1">Search for Shops</div>
            <div className="step-card-1-2">
              Discover nearby shops with real-time status updates (open or closed) and access comprehensive shop information to make informed decisions.
            </div>
          </div>
        </div>
        <div className="step-card">
          <img
            src={hc1}
            style={{ height: "90%" }}
            alt="Add to cart"
            className="step-icon"
            loading="lazy"
          />
          <div className="step-card-1">
            <div className="step-card-1-1">Add Products to Cart</div>
            <div className="step-card-1-2">
              Select your desired products and add them to your cart for a seamless shopping experience. Review your items before proceeding to checkout.
            </div>
          </div>
        </div>
        <div className="step-card">
          <img
            src={hpp1}
            style={{ height: "90%" }}
            alt="Place order"
            className="step-icon"
            loading="lazy"
          />
          <div className="step-card-1">
            <div className="step-card-1-1">Place Your Order</div>
            <div className="step-card-1-2">
              Once your order is placed, it will be received by the shop owner who possesses the products. The shop will handle the delivery process to ensure your items arrive promptly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;