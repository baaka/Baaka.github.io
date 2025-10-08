import React, { useState, useEffect, useCallback } from "react";
import "./SearchField.css";

const SearchField = ({ placeholder = "Search...", onSearch }) => {
  const [query, setQuery] = useState("");

  // Debounced automatic search
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (onSearch && searchQuery.length >= 5) {
        onSearch(searchQuery);
      }
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    if (query.length >= 5) {
      debouncedSearch(query);
    }
  }, [query, debouncedSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Clear search if query becomes too short
    if (newQuery.length < 5 && onSearch) {
      onSearch("");
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
      />
      <button type="submit" className="search-button">
        🔍
      </button>
    </form>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default SearchField;
