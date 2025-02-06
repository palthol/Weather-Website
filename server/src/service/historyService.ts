import fs from 'fs/promises';
import path, { dirname }from 'path';
import { fileURLToPath } from 'url';

// Define City class
class City {
  constructor(public id: string, public name: string) {}
}

// ESM replacement for __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

class HistoryService {
  private readonly filePath = path.join(__dirname, 'searchHistory.json');

  // Read from searchHistory.json
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error) {
      console.error('Error reading history file:', error);
      return [];
    }
  }

  // Write to searchHistory.json
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing to history file:', error);
    }
  }

  // Get all saved cities
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Add a city to search history
  async addCity(cityName: string): Promise<{ success: boolean; message: string }> {
    const cities = await this.read();

    // Prevent duplicates
    if (cities.some(city => city.name.toLowerCase() === cityName.toLowerCase())) {
      return { success: false, message: 'City is already in history' };
    }

    const newCity = new City(Date.now().toString(), cityName);
    cities.push(newCity);
    await this.write(cities);

    return { success: true, message: 'City added successfully' };
  }

  // Remove a city from search history
  async removeCity(id: string): Promise<{ success: boolean; message: string }> {
    let cities = await this.read();
    const newCities = cities.filter(city => city.id !== id);

    if (cities.length === newCities.length) {
      return { success: false, message: 'City not found' };
    }

    await this.write(newCities);
    return { success: true, message: 'City removed successfully' };
  }
}

export default new HistoryService();
