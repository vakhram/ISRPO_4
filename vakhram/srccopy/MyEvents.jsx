import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MyEvents = () => {
  const [attendingEvents, setAttendingEvents] = useState([]);

  useEffect(() => {
    const storedEvents = localStorage.getItem("attendingEvents");
    if (storedEvents) {
      setAttendingEvents(JSON.parse(storedEvents));
    }
  }, []);

  const handleRemoveEvent = (eventId) => {
    const updatedEvents = attendingEvents.filter((event) => event.id !== eventId);
    setAttendingEvents(updatedEvents);
    localStorage.setItem("attendingEvents", JSON.stringify(updatedEvents));
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", color: "#fff" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Мои события</h2>
      {attendingEvents.length > 0 ? (
        <ul style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {attendingEvents.map((event) => {
            const imageUrl = event.images?.length > 0 ? event.images[0].image : "/img/not_image.png";
            return (
              <li key={event.id} style={{ listStyle: "none" }}>
                <div
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderRadius: "12px",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
                    padding: "1.5rem",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    cursor: "pointer",
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
                    onClick={() => handleRemoveEvent(event.id)}
                    style={{
                      marginTop: "1rem",
                      padding: "0.7rem 1.5rem",
                      backgroundColor: "#ff4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#d91b1b";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ff4444";
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p style={{ color: "#fff" }}>Вы пока не выбрали ни одного события.</p>
      )}
    </div>
  );
};

export default MyEvents;