import React, { useEffect, useState } from "react";

type Hero = {
    title: string;
    subtitle: string;
    cta: string;
};

type Category = {
    id: string;
    name: string;
    icon: string;
};

type Product = {
    id: number;
    name: string;
    category: string;
    brand: string;
    price: number;
    image: string;
    description: string;
    specs: string[];
    inStock: boolean;
};

type Contact = {
    email: string;
    phone: string;
    address: string;
};

type Data = {
    hero: Hero;
    categories: Category[];
    products: Product[];
    brands: string[];
    contact: Contact;
};

const App: React.FC = () => {
    const [data, setData] = useState<Data | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedBrand, setSelectedBrand] = useState<string>("all");
    const [showInStock, setShowInStock] = useState(false);
    const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");

    useEffect(() => {
        fetch("/data/data.json")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch data");
                return res.json();
            })
            .then(setData)
            .catch((err) => setError(err.message));
    }, []);

    if (error) return <div className="text-red-500 p-4">{error}</div>;
    if (!data) return <div className="p-4">Loading...</div>;

    // Filter products
    const filteredProducts = data.products
        .filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
            const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand;
            const matchesStock = !showInStock || product.inStock;

            return matchesSearch && matchesCategory && matchesBrand && matchesStock;
        })
        .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "price-asc") return a.price - b.price;
            if (sortBy === "price-desc") return b.price - a.price;
            return 0;
        });

    const scrollToProducts = () => {
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="font-sans">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">{data.hero.title}</h1>
                    <div className="flex gap-6">
                        <a href="#products" className="text-gray-700 hover:text-blue-600 transition">Products</a>
                        <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="min-h-[70vh] flex flex-col justify-center items-center text-center bg-gradient-to-br from-blue-600 to-blue-800 text-white px-4">
                <h1 className="text-5xl md:text-6xl font-bold mb-4">{data.hero.title}</h1>
                <p className="text-xl md:text-2xl mb-8">{data.hero.subtitle}</p>
                <button
                    onClick={scrollToProducts}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                >
                    {data.hero.cta}
                </button>
            </section>

            {/* Categories Section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {data.categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setSelectedCategory(category.id);
                                    scrollToProducts();
                                }}
                                className={`p-6 rounded-xl shadow-md hover:shadow-lg transition text-center ${
                                    selectedCategory === category.id
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-800"
                                }`}
                            >
                                <div className="text-4xl mb-2">{category.icon}</div>
                                <h3 className="font-semibold">{category.name}</h3>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">Our Products</h2>

                    {/* Filters */}
                    <div className="bg-gray-50 p-6 rounded-lg mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {/* Category Filter */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Categories</option>
                                {data.categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            {/* Brand Filter */}
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Brands</option>
                                {data.brands.map((brand) => (
                                    <option key={brand} value={brand}>
                                        {brand}
                                    </option>
                                ))}
                            </select>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>

                            {/* In Stock Toggle */}
                            <label className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showInStock}
                                    onChange={(e) => setShowInStock(e.target.checked)}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">In Stock Only</span>
                            </label>
                        </div>

                        {/* Active Filters Summary */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {selectedCategory !== "all" && (
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Category: {data.categories.find(c => c.id === selectedCategory)?.name}
                                    <button onClick={() => setSelectedCategory("all")} className="hover:text-blue-600">×</button>
                </span>
                            )}
                            {selectedBrand !== "all" && (
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Brand: {selectedBrand}
                                    <button onClick={() => setSelectedBrand("all")} className="hover:text-blue-600">×</button>
                </span>
                            )}
                            {showInStock && (
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  In Stock
                  <button onClick={() => setShowInStock(false)} className="hover:text-green-600">×</button>
                </span>
                            )}
                        </div>

                        {/* Results Count */}
                        <p className="mt-4 text-gray-600">
                            Showing {filteredProducts.length} of {data.products.length} products
                        </p>
                    </div>

                    {/* Product Grid */}
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-xl">No products found matching your criteria</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    {/* Product Image */}
                                    <div className="relative">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        {!product.inStock && (
                                            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                                                Out of Stock
                                            </div>
                                        )}
                                        {product.inStock && (
                                            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                                                In Stock
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                                        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3">{product.description}</p>

                                        {/* Specs */}
                                        <ul className="mb-3 space-y-1">
                                            {product.specs.slice(0, 3).map((spec, idx) => (
                                                <li key={idx} className="text-xs text-gray-500">
                                                    • {spec}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Price */}
                                        <div className="flex justify-between items-center">
                                            <p className="text-2xl font-bold text-blue-600">
                                                ${product.price}
                                            </p>
                                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Contact Us</h2>
                    <div className="max-w-2xl mx-auto">
                        <p className="mb-2 text-lg">📧 Email: {data.contact.email}</p>
                        <p className="mb-2 text-lg">📞 Phone: {data.contact.phone}</p>
                        <p className="mb-6 text-lg">📍 Address: {data.contact.address}</p>
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
                            Send Message
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2025 {data.hero.title}. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
