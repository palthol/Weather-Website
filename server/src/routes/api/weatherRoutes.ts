import { Router, type Request, type Response } from 'express';
import axios from 'axios';

const router = Router();

// Temporary in-memory storage for search history
const searchHistory: { id: number; city: string; timestamp: Date }[] = [];

// POST Request with city name to retrieve weather data
router.post('/weather', async (req: Request, res: Response) => {
  const { city } = req.body;

  // Validate input
  if (!city) {
    return res.status(400).json({ error: 'City name is required.' });
  }

  try {
    // GET weather data from OpenWeather API
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
      params: { q: city, appid: apiKey, units: 'metric' },
    });

    // Save city to search history
    const entry = {
      id: searchHistory.length + 1,
      city,
      timestamp: new Date(),
    };
    searchHistory.push(entry);

    // Respond with weather data
    return res.status(200).json({ weatherData: response.data, history: entry });
  } catch (error) {
    // Handle errors (e.g., city not found, API issues)
    if (axios.isAxiosError(error)) {
      const { response } = error;
      return res.status(response?.status ?? 500).json({
        error: response?.data?.message || 'Failed to fetch weather data.',
      });
    }
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET search history
router.get('/history', (_: Request, res: Response) => {
  // Return search history
  return res.status(200).json(searchHistory);
});

// DELETE city from search history
router.delete('/history/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  // Find index of the entry to delete
  const index = searchHistory.findIndex((entry) => entry.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: 'City not found in history.' });
  }

  // Remove from history
  searchHistory.splice(index, 1);
  return res.status(200).json({ message: 'City removed from history.' });
});

export default router;
