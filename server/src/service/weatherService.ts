import axios from 'axios';

// Define a class for the Weather object
class Weather {
  constructor(
    public temperature: number,
    public description: string,
    public icon: string,
    public date: Date
  ) {}
}

class WeatherService {
  private readonly baseURL = 'https://api.openweathermap.org/data/2.5';
  private readonly apiKey = process.env.OPENWEATHER_API_KEY ?? '';
  private readonly cityName: string;

  constructor(cityName: string) {
    this.cityName = cityName;
    if (!this.apiKey) {
      throw new Error('API key is missing. Please set the OPENWEATHER_API_KEY environment variable.');
    }
  }

  private async fetchLocationData(query: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/weather`, {
        params: { q: query, appid: this.apiKey },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error in fetchLocationData:', error.response?.data || error.message);
        throw new Error('Failed to fetch location data.');
      }
      console.error('Unexpected error in fetchLocationData:', error);
      throw new Error('An unexpected error occurred.');
    }
  }

  private destructureLocationData(locationData: any): { lat: number; lon: number } {
    if (!locationData?.coord) {
      throw new Error('Invalid location data received from API.');
    }
    return {
      lat: locationData.coord.lat,
      lon: locationData.coord.lon,
    };
  }

  private async fetchWeatherData(coordinates: { lat: number; lon: number }): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/onecall`, {
        params: {
          lat: coordinates.lat,
          lon: coordinates.lon,
          exclude: 'minutely,hourly',
          appid: this.apiKey,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error in fetchWeatherData:', error.response?.data || error.message);
        throw new Error('Failed to fetch weather data.');
      }
      console.error('Unexpected error in fetchWeatherData:', error);
      throw new Error('An unexpected error occurred.');
    }
  }

  private createWeatherObject(data: any): Weather {
    return new Weather(
      data.temp.day || data.temp,
      data.weather[0].description,
      data.weather[0].icon,
      new Date(data.dt * 1000)
    );
  }

  private parseCurrentWeather(response: any): Weather {
    return this.createWeatherObject(response.current);
  }

  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.map((data: any) => this.createWeatherObject(data));
  }

  async getWeatherForCity(): Promise<{ current: Weather; forecast: Weather[] }> {
    const locationData = await this.fetchLocationData(this.cityName);
    const coordinates = this.destructureLocationData(locationData);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(weatherData.daily);
    return { current: currentWeather, forecast };
  }
}

export default WeatherService;
