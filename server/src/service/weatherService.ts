import axios from 'axios';

const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY ?? '5a6ee1341282dc1e7daac273ccfd3182';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export const getWeather = async (city: string) => {
  if (!city) {
    throw new Error('City name is required');
  }

  // construct URL
  const apiUrl = `${BASE_URL}?q=${encodeURIComponent(city)}&units=imperial&appid=${OPEN_WEATHER_API_KEY}`;
// construct request
  const response = await axios.get(apiUrl);
  
  if (!response.data) {
    throw new Error('Failed to fetch weather data');
  }

  const data = response.data;
  const currentItem = data.list[0];

  return {
    city: data.city.name,
    date: new Date(currentItem.dt_txt).toLocaleDateString(),
    icon: currentItem.weather[0].icon,
    iconDescription: currentItem.weather[0].description,
    tempF: Math.round(currentItem.main.temp),
    windSpeed: currentItem.wind.speed,
    humidity: currentItem.main.humidity,
  };
};
