import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import "./ProductsPage.css";
import loadAllData from "../utils/dataLoader";
import getImageSrc from "../utils/imageLoader";

const ProductsPage = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Load all data dynamically
    const allData = loadAllData();

    // Flatten and add image paths
    const allProducts = allData.flatMap((category) =>
      category.data.map((product) => ({
        ...product,
        type: category.type,
        imageSrc: getImageSrc(category.type, product.id),
      }))
    );

    setProducts(allProducts);
  }, []);

  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.price.toLowerCase().includes(query) ||
      product.type.toLowerCase().includes(query) ||
      (product.availability ? "available" : "unavailable").includes(query)
    );
  });

  return (
    <div className="products-page">
      <h2>Our Products</h2>
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={`${product.type}-${product.id}`}
              product={product}
              imageSrc={product.imageSrc}
            />
          ))
        ) : searchQuery ? (
          <div className="no-results">
            <p>No products found matching "{searchQuery}"</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductsPage;
