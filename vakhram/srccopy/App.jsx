import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { SearchProvider } from "./SearchContext";
import Events from "./Events";
import EventDetails from "./EventDetails";
import MyEvents from "./MyEvents";

function App() {
  const [citySlug, setCitySlug] = useState("kzn");
  return (
    <SearchProvider>
      <Router>
        <div style={{ padding: "1rem", backgroundColor: "#242424" }}>
          <select
            value={citySlug}
            onChange={(e) => setCitySlug(e.target.value)}
            style={{
              padding: "10px",
              marginBottom: "1rem",
              borderRadius: "8px",
              backgroundColor: "#1a1a1a",
              color: "#fff",
              border: "1px solid #646cff",
            }}
          >
            <option value="kzn">Казань</option>
            <option value="msk">Москва</option>
            <option value="spb">Санкт-Петербург</option>
          </select>
          <nav className="nav-links">
            <Link
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              События
            </Link>
            <Link
              to="/my-events"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Мои события
            </Link>
          </nav>
          <Routes>
            <Route path="/" element={<Events citySlug={citySlug} />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/my-events" element={<MyEvents />} />
          </Routes>
        </div>
      </Router>
    </SearchProvider>
  );
}

export default App;