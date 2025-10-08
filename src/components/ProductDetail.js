import React, { useState } from "react";
import "./ProductDetail.css";

const ProductDetail = ({ product, images, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="product-detail-overlay" onClick={handleOverlayClick}>
      <div className="product-detail-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="product-detail-content">
          {/* Image Gallery Section */}
          <div className="product-gallery">
            <div className="main-image-container">
              <img
                src={images[currentImageIndex].src}
                alt={images[currentImageIndex].alt}
                className="main-image"
              />

              {images.length > 1 && (
                <>
                  <button className="gallery-nav prev" onClick={prevImage}>
                    ‹
                  </button>
                  <button className="gallery-nav next" onClick={nextImage}>
                    ›
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="thumbnail-strip">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${
                      index === currentImageIndex ? "active" : ""
                    }`}
                    onClick={() => goToImage(index)}
                  >
                    <img src={image.src} alt={`Thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information Section */}
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-price">{product.price}</div>

            <div
              className={`product-availability ${
                product.availability ? "available" : "unavailable"
              }`}
            >
              {product.availability ? "✓ Available" : "✗ Out of Stock"}
            </div>

            <div className="product-description">
              <h3>Overview</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-full-description">
              <h3>Detailed Description</h3>
              <p>{product.fullDescription}</p>
            </div>

            {product.specifications && (
              <div className="product-specifications">
                <h3>Specifications</h3>
                <div className="specs-grid">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="spec-item">
                        <span className="spec-label">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                          :
                        </span>
                        <span className="spec-value">{value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="product-category">
              <span className="category-badge">{product.type}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
