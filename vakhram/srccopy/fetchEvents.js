import axios from "axios";

export async function fetchEvents(citySlug = "msk", query = "") {
  const actualSinceDate = Math.floor(new Date("2025-04-06T00:00:00").getTime() / 1000);
  const baseUrl = "https://cors-anywhere.herokuapp.com/https://kudago.com/public-api/v1.4"; // Базовый URL API

  const retryRequest = async (attempts = 3, delay = 1000) => {
    for (let i = 0; i < attempts; i++) {
      try {
        const response = await axios.get(`${baseUrl}/events/`, {
          params: {
            location: citySlug,
            expand: "place,images",
            fields: "id,title,place,dates,images",
            actual_since: actualSinceDate,
          },
        });
        let events = response.data.results || [];
        if (query.trim()) {
          const lowerQuery = query.trim().toLowerCase();
          events = events.filter(
            (event) =>
              event.title.toLowerCase().includes(lowerQuery) ||
              (event.place && event.place.title.toLowerCase().includes(lowerQuery))
          );
        }
        return events;
      } catch (err) {
        if (err.response && err.response.status === 503 && i < attempts - 1) {
          console.warn(`503 ошибка, повторная попытка ${i + 1} через ${delay}мс`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        throw err;
      }
    }
  };
  try {
    return await retryRequest();
  } catch (err) {
    console.error("Ошибка при загрузке событий:", err);
    throw new Error("Ошибка загрузки данных: " + (err.response?.status || err.message));
  }
}