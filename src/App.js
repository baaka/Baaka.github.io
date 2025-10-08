import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductsPage from "./components/ProductsPage";
import "./index.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="app-container">
      <Header onSearch={handleSearch} />
      <main className="main-content">
        <ProductsPage searchQuery={searchQuery} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
