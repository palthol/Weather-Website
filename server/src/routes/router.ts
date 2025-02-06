import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import HistoryService from "../service/historyService.js";
import { getWeather } from "../service/weatherService.js";

dotenv.config();

const router: Router = express.Router();

// ============================
// API Routes
// ============================

/**
 * GET /api/weather/:city
 * Fetches weather data for a given city.
 */
router.get("/:city", async (req: Request, res: Response) => {
  const { city } = req.params;

  try {
    const weatherData = await getWeather(city);
    return res.json(weatherData);

    // error handling
  } catch (error) {
    console.error("Error fetching weather:", error);
    return res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

/**
 * POST /api/weather
 * Saves a city to search history and returns weather data.
 */
router.post("/", async (req: Request, res: Response) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: "City name is required" });
  }
  try {
    const historyResponse = await HistoryService.addCity(city);

    if (!historyResponse.success) {
      return res.status(400).json(historyResponse);
    }
    const weatherData = await getWeather(city);
    return res.json(weatherData);

    // error handling
  } catch (error) {
    console.error("Error saving city and fetching weather:", error);
    return res.status(500).json({ error: "Failed to save city and fetch weather" });
  }
});

/**
 * GET /api/weather/history
 * Retrieves the search history of previously searched cities.
 */
router.get("/history", async (_: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    return res.json(cities);

    // error handling
  } catch (error) {
    console.error("Error fetching search history:", error);
    return res.status(500).json({ error: "Failed to retrieve search history" });
  }
});

/**
 * DELETE /api/weather/history/:id
 * Deletes a city from the search history by ID.
 */
router.delete("/history/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteResponse = await HistoryService.removeCity(id);
    if (!deleteResponse.success) {
      return res.status(400).json(deleteResponse);
    }

    return res.json({ message: "City successfully deleted from history" });

    // error handling
  } catch (error) {
    console.error("Error deleting city:", error);
    return res.status(500).json({ error: "Failed to delete city" });
  }
});

// Export the merged router
export default router;
