import express from 'express';
import weatherService from '../../service/weatherService';
import historyService from '../../service/historyService';

const router = express.Router();

// GET weather data for a city
router.get('/:city', async (req, res) => {
    const { city } = req.params;

    try {
        const weatherData = await weatherService.getWeather(city);
        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// POST a city to search history and return its weather data
router.post('/', async (req, res) => {
    const { city } = req.body;

    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const historyResponse = await historyService.addCity(city);

        if (!historyResponse.success) {
            return res.status(400).json(historyResponse);
        }

        const weatherData = await weatherService.getWeather(city);
        res.json(weatherData);
    } catch (error) {
        console.error('Error saving city and fetching weather:', error);
        res.status(500).json({ error: 'Failed to save city and fetch weather' });
    }
});

// DELETE a city from search history
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleteResponse = await historyService.removeCity(id);

        if (!deleteResponse.success) {
            return res.status(400).json(deleteResponse);
        }

        res.json(deleteResponse);
    } catch (error) {
        console.error('Error deleting city:', error);
        res.status(500).json({ error: 'Failed to delete city' });
    }
});

export default router;
