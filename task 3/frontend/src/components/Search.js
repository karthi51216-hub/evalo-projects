import { useState, useRef } from "react";
import axios from "axios";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // ✅ FIX: proper debounce storage
  const timerRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    // clear previous timer
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      if (value.length < 2) {
        setResults([]);
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/search/?q=${value}`
        );

        console.log("API RESPONSE:", res.data);

        // ✅ SAFE FIX (handles all backend formats)
        const data =
          res.data?.results ||
          res.data?.data ||
          (Array.isArray(res.data) ? res.data : []);

        setResults(data);
      } catch (err) {
        console.error("Search Error:", err);
        setResults([]);
      }
    }, 500);
  };

  return (
    <div style={{ width: "80%", margin: "40px auto" }}>
      
      {/* 🔍 SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={handleSearch}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          outline: "none"
        }}
      />

      {/* 🧠 NO RESULT HANDLING */}
      {query.length >= 2 && results.length === 0 && (
        <p style={{ textAlign: "center", color: "gray" }}>
          No products found
        </p>
      )}

      {/* 🛒 PRODUCT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px"
        }}
      >
        {results.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            {/* 📸 IMAGE */}
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "6px"
              }}
            />

            {/* 📝 NAME */}
            <h4 style={{ margin: "10px 0" }}>
              {item.name}
            </h4>

            {/* 💰 PRICE */}
            <p style={{ color: "green", fontWeight: "bold" }}>
              ₹{item.price}
            </p>

            {/* 🛒 BUTTON */}
            <button
              style={{
                padding: "8px 12px",
                backgroundColor: "#ff9900",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}