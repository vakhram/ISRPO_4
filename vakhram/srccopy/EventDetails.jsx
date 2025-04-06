import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`/api/events/${id}/`, {
          params: {
            expand: "place,images,description",
            fields: "id,title,place,dates,images,description",
          },
        });
        setEvent(response.data);
      } catch (err) {
        setError("Ошибка загрузки данных: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  if (loading) return <p style={{ color: "#fff", textAlign: "center" }}>Загрузка...</p>;
  if (error) return <p style={{ color: "#ff4444", textAlign: "center" }}>{error}</p>;
  if (!event) return <p style={{ color: "#fff", textAlign: "center" }}>Событие не найдено</p>;

  const imageUrl = event.images?.length > 0 ? event.images[0].image : "/img/not_image.png";

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", color: "#fff" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>{event.title}</h1>
      <img
        src={imageUrl}
        alt={event.title}
        style={{
          width: "100%",
          maxHeight: "400px",
          objectFit: "cover",
          borderRadius: "12px",
          marginBottom: "2rem",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        }}
      />
      <div style={{ backgroundColor: "#1a1a1a", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}>
        <p style={{ margin: "1rem 0", fontSize: "1.1rem" }}>
          <strong>Место:</strong> {event.place ? event.place.title : "не указано"}
        </p>
        <p style={{ margin: "1rem 0", fontSize: "1.1rem" }}>
          <strong>Дата:</strong>{" "}
          {event.dates && event.dates.length > 0
            ? new Date(event.dates[0].start * 1000).toLocaleString("ru-RU")
            : "неизвестна"}
        </p>
        <p style={{ margin: "1rem 0", fontSize: "1.1rem", lineHeight: "1.6" }}>
          <strong>Описание:</strong>{" "}
          {event.description ? (
            <div
              dangerouslySetInnerHTML={{ __html: event.description }}
              style={{ color: "#ccc", fontSize: "1rem", lineHeight: "1.6" }}
            />
          ) : (
            "Описание отсутствует"
          )}
        </p>
      </div>
    </div>
  );
};

export default EventDetails;