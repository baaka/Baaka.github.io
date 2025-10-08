import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, imageSrc }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imageSrc} alt={product.name} />
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
          {product.availability ? "Available" : "Out of Stock"}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
