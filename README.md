# Weather Dashboard

A modern web application to view live weather data and 5-day forecasts for any city, with theme switching, recent searches, and geolocation support.

## Features
- **Live Weather:** Get current temperature, humidity, wind speed, and weather description for any city.
- **5-Day Forecast:** See a horizontal, interactive forecast for the next 5 days.
- **Dynamic Backgrounds:** Background color and icon change based on the current weather.
- **Theme Toggle:** Switch between light and dark mode with a single click.
- **Recent Searches:** Quickly revisit up to 5 recent city searches.
- **Geolocation:** On load, optionally fetch and display weather for your current location (with permission).
- **Loading Indicator:** Spinner shown while fetching location or weather data.

## How to Use
1. **Clone or Download** this repository.
2. **Get an OpenWeatherMap API Key:**
   - Sign up at https://openweathermap.org/api
   - Copy your API key.
3. **Configure the API Key:**
   - Open `script.js` and replace `'YOUR_API_KEY_HERE'` with your actual API key.
4. **Open `index.html` in your browser.**

## Project Structure
- `index.html` – Main HTML structure
- `style.css` – All styles, including themes and weather backgrounds
- `script.js` – Handles API calls, UI updates, geolocation, and local storage

## Notes
- Works on all modern browsers.
- No backend required; all data is fetched from OpenWeatherMap.
- For best results, allow location access when prompted.

## Screenshots
![Weather Dashboard Screenshot](screenshot.png)

---

© 2025 Your Name. Licensed under MIT.
