

import { useState } from "react";
import axios from "axios";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  let timer;

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    clearTimeout(timer);

    timer = setTimeout(async () => {
      if (value.length < 2) {
        setResults([]);
        return;
      }

      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/search/?q=${value}`
        );
        setResults(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 500);
  };

  return (
    <div style={{ width: "80%", margin: "40px auto" }}>
      
      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={handleSearch}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          marginBottom: "20px"
        }}
      />

      {/* 🛒 Product Grid */}
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
            {/* 📸 Image */}
            <img
              src={item.image}
              alt={item.name}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />

            {/* 📝 Name */}
            <h4 style={{ margin: "10px 0" }}>{item.name}</h4>

            {/* 💰 Price */}
            <p style={{ color: "green", fontWeight: "bold" }}>
              ₹{item.price}
            </p>

            {/* 🛒 Button */}
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

