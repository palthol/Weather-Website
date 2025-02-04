import { Router, Request, Response } from 'express';
import HistoryService from './historyService.js';

const router = Router();

// For safety, store your API key in environment variables
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY || 'YOUR_KEY_HERE';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// -----------------------------------------------------------------------------
// POST /api/weather
// 1. Expects { cityName } in the request body
// 2. Uses native fetch to call OpenWeather
// 3. Transforms data to match your frontend structure if needed
// 4. Saves city to search history via HistoryService
// -----------------------------------------------------------------------------
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body as { cityName: string };

    if (!cityName) {
      return res.status(400).json({ message: 'City name is required' });
    }

    // -- 1) Fetch data from OpenWeather using native fetch
    const apiUrl = `${BASE_URL}?q=${encodeURIComponent(cityName)}&units=imperial&appid=${OPEN_WEATHER_API_KEY}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenWeather request failed: ${errorText}`);
    }
    const data = await response.json();

    // -- 2) Transform the data if you want a "current weather + 5-day forecast" array
    // "data.list" contains forecast in 3-hour increments. Example transformation:
    const currentItem = data.list[0];
    const currentWeather = {
      city: data.city.name,
      date: new Date(currentItem.dt_txt).toLocaleDateString(),
      icon: currentItem.weather[0].icon,
      iconDescription: currentItem.weather[0].description,
      tempF: Math.round(currentItem.main.temp),
      windSpeed: currentItem.wind.speed,
      humidity: currentItem.main.humidity,
    };

    // For a 5-day forecast, pick one entry per day (for simplicity, every 8th record ~ 24 hours)
    const forecastList = data.list.filter((_: any, index: number) => index % 8 === 0 && index !== 0);
    const forecastData = forecastList.map((item: any) => ({
      date: new Date(item.dt_txt).toLocaleDateString(),
      icon: item.weather[0].icon,
      iconDescription: item.weather[0].description,
      tempF: Math.round(item.main.temp),
      windSpeed: item.wind.speed,
      humidity: item.main.humidity,
    }));

    const combinedWeather = [currentWeather, ...forecastData];

    // -- 3) Save city to search history
    //   Make sure your HistoryService is implemented properly.
    await HistoryService.addCity(data.city.name); 

    // -- 4) Send the combined data back to the frontend
    return res.json(combinedWeather);
  } catch (error: any) {
    console.error('Error in POST /api/weather:', error.message);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
});

// -----------------------------------------------------------------------------
// GET /api/weather/history
// 1. Reads all cities from searchHistory.json using HistoryService
// 2. Returns an array of city objects to the frontend
// -----------------------------------------------------------------------------
router.get('/history', async (req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    return res.json(cities);
  } catch (error: any) {
    console.error('Error in GET /api/weather/history:', error.message);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
});

// -----------------------------------------------------------------------------
// DELETE /api/weather/history/:id
// * BONUS: Remove a city from the search history by its ID
// -----------------------------------------------------------------------------
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    return res.json({ message: 'City successfully deleted from history' });
  } catch (error: any) {
    console.error('Error in DELETE /api/weather/history/:id:', error.message);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
});

export default router;
