import { useState, useEffect } from "react";
import axios from "axios";

const Cities = ({ onSelectCity }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("/api/locations/?lang=ru");
        setCities(response.data);
      } catch (err) {
        setError("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Список городов</h2>
      <div className="buttons">
        {cities.map((city) => (
          <button
            key={city.slug}
            onClick={() => onSelectCity(city.slug, city.name)}
          >
            <strong>{city.name}</strong>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Cities;
