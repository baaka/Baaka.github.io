import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import "./ProductsPage.css";
import loadAllData from "../utils/dataLoader";
import { getProductImages } from "../utils/imageLoader";

const ProductsPage = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load all data dynamically
    const allData = loadAllData();

    // Flatten and add image paths
    const allProducts = allData.flatMap((category) =>
      category.data.map((product) => ({
        ...product,
        type: category.type,
        images: getProductImages(category.type, product.id),
      }))
    );

    setProducts(allProducts);

    // Extract unique categories
    const uniqueCategories = [...new Set(allData.map((cat) => cat.type))];
    setCategories(uniqueCategories);
  }, []);

  const filteredProducts = products.filter((product) => {
    // Category filter
    const categoryMatch =
      selectedCategory === "all" || product.type === selectedCategory;

    // Search filter
    let searchMatch = true;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      searchMatch =
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.price.toLowerCase().includes(query) ||
        product.type.toLowerCase().includes(query) ||
        (product.availability ? "available" : "unavailable").includes(query);
    }

    return categoryMatch && searchMatch;
  });

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="products-page">
      {/* Category Filter Buttons */}
      <div className="category-filters">
        <button
          className={`category-btn ${
            selectedCategory === "all" ? "active" : ""
          }`}
          onClick={() => setSelectedCategory("all")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={`${product.type}-${product.id}`}
              product={product}
              images={product.images}
              onClick={() => handleProductClick(product)}
            />
          ))
        ) : (
          <div className="no-results">
            <p>
              No products found
              {searchQuery && selectedCategory !== "all"
                ? ` matching "${searchQuery}" in ${selectedCategory}`
                : searchQuery
                ? ` matching "${searchQuery}"`
                : selectedCategory !== "all"
                ? ` in ${selectedCategory} category`
                : ""}
            </p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {isModalOpen && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          images={selectedProduct.images}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProductsPage;
