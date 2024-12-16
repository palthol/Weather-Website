import fs from 'fs/promises';
import path from 'path';

// Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string) {}
}

// Complete the HistoryService class
class HistoryService {
  private filePath = path.join(__dirname, '../../db/db.json');

  // Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    const data = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(data) as City[];
  }

  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return this.read();
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(cityName, (cities.length + 1).toString());
    cities.push(newCity);
    await this.write(cities);
  }

  // Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();