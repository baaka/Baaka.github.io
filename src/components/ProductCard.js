import React, { useState } from "react";
import "./ProductCard.css";

const ProductCard = ({ product, images, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-image">
        {images && images.length > 0 && (
          <>
            <img
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
            />

            {images.length > 1 && (
              <>
                {/* Navigation arrows */}
                <button className="image-nav prev" onClick={prevImage}>
                  ‹
                </button>
                <button className="image-nav next" onClick={nextImage}>
                  ›
                </button>

                {/* Image indicators */}
                <div className="image-indicators">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${
                        index === currentImageIndex ? "active" : ""
                      }`}
                      onClick={(e) => goToImage(index, e)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <p className="price">{product.price}</p>
        <p
          className={`availability ${
            product.availability ? "available" : "unavailable"
          }`}
        >
          {product.availability ? "ხელმისაწვდომი" : "არ არის ხელმისაწვდომი"}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
