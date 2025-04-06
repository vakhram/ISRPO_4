import { useState, useEffect } from "react";
import { fetchEvents } from "./fetchEvents";
import { useSearch } from "./SearchContext";
import { Link } from "react-router-dom";

const Events = ({ citySlug }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { query, setQuery } = useSearch();
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Загрузка событий из localStorage
  const loadAttendingEvents = () => {
    const storedEvents = localStorage.getItem("attendingEvents");
    return storedEvents ? JSON.parse(storedEvents) : [];
  };

  const [attendingEvents, setAttendingEvents] = useState(loadAttendingEvents);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchEvents(citySlug, debouncedQuery);
        setEvents(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [citySlug, debouncedQuery]);

  // Добавление события в список "Пойду"
  const handleAttendEvent = (event) => {
    const updatedAttendingEvents = [...attendingEvents, event];
    setAttendingEvents(updatedAttendingEvents);
    localStorage.setItem("attendingEvents", JSON.stringify(updatedAttendingEvents));
  };

  // Удаление события из списка "Пойду"
  const handleRemoveEvent = (eventId) => {
    const updatedAttendingEvents = attendingEvents.filter((event) => event.id !== eventId);
    setAttendingEvents(updatedAttendingEvents);
    localStorage.setItem("attendingEvents", JSON.stringify(updatedAttendingEvents));
  };

  // Проверка, добавлено ли событие в "Пойду"
  const isEventAttended = (eventId) => {
    return attendingEvents.some((event) => event.id === eventId);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#fff" }}>События</h2>
      <input
        type="text"
        placeholder="Поиск события или места..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "12px",
          marginBottom: "2rem",
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #646cff",
          fontSize: "1rem",
          backgroundColor: "#1a1a1a",
          color: "#fff",
        }}
      />
      {loading && <p style={{ color: "#fff" }}>Загрузка...</p>}
      {error && <p style={{ color: "#ff4444" }}>{error}</p>}
      {events.length > 0 ? (
        <ul style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {events.map((event) => {
            const imageUrl = event.images?.length > 0 ? event.images[0].image : "/img/not_image.png";
            const attended = isEventAttended(event.id);
            return (
              <li key={event.id} style={{ listStyle: "none" }}>
                <Link
                  to={`/event/${event.id}`}
                  target="_blank"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      backgroundColor: "#1a1a1a",
                      borderRadius: "12px",
                      boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
                      padding: "1.5rem",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 10px 20px rgba(100,108,255,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.3)";
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "1rem",
                      }}
                    />
                    <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", color: "#fff" }}>
                      {event.title}
                    </h3>
                    <p style={{ margin: "0.5rem 0", color: "#ccc" }}>
                      <strong>Место:</strong> {event.place ? event.place.title : "не указано"}
                    </p>
                    <p style={{ margin: "0.5rem 0", color: "#ccc" }}>
                      <strong>Дата:</strong>{" "}
                      {event.dates && event.dates.length > 0
                        ? new Date(event.dates[0].start * 1000).toLocaleString("ru-RU")
                        : "неизвестна"}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (attended) {
                          handleRemoveEvent(event.id);
                        } else {
                          handleAttendEvent(event);
                        }
                      }}
                      style={{
                        marginTop: "1rem",
                        padding: "0.7rem 1.5rem",
                        backgroundColor: attended ? "#ff4444" : "#646cff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = attended ? "#d91b1b" : "#535bf2";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = attended ? "#ff4444" : "#646cff";
                      }}
                    >
                      {attended ? "Не пойду" : "Пойду"}
                    </button>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        !loading && !error && <p style={{ color: "#fff" }}>Событий не найдено</p>
      )}
    </div>
  );
};

export default Events;