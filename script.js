// Ask for geolocation permission and display weather for current location
window.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        const ask = confirm('Do you want to allow access to your current location to display local weather?');
        if (ask) {
            weatherResult.innerHTML = '<span class="loading-spinner"></span> Fetching your location...';
            document.getElementById('forecast').innerHTML = '';
            navigator.geolocation.getCurrentPosition(
                pos => {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;
                    getWeatherByCoords(lat, lon);
                    getForecastByCoords(lat, lon);
                },
                err => {
                    weatherResult.innerHTML = '<span style="color:red;">Could not get your location.</span>';
                }
            );
        }
    }
});
// Add loading spinner style
const spinnerStyle = document.createElement('style');
spinnerStyle.innerHTML = `
.loading-spinner {
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 3px solid #b3e5fc;
  border-top: 3px solid #0288d1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  vertical-align: middle;
  margin-right: 8px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(spinnerStyle);

function getWeatherByCoords(lat, lon) {
    weatherResult.innerHTML = 'Loading...';
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) throw new Error('Location weather not found');
            return response.json();
        })
        .then(data => {
            saveRecentSearch(data.name);
            displayWeather(data);
        })
        .catch(error => {
            weatherResult.innerHTML = `<span style="color:red;">${error.message}</span>`;
        });
}

function getForecastByCoords(lat, lon) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = 'Loading 5-day forecast...';
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) throw new Error('Forecast not found');
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            forecastDiv.innerHTML = `<span style="color:red;">${error.message}</span>`;
        });
}
// Weather Dashboard JavaScript
const apiKey = 'b95f47bcfb4b966ebb6590b1a45aa238'; // <-- Replace with your OpenWeatherMap API key


const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const recentSearchesDiv = document.getElementById('recentSearches');


searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        saveRecentSearch(city);
        getWeather(city);
        getForecast(city);
    } else {
        weatherResult.innerHTML = '<span style="color:red;">Please enter a city name.</span>';
    }
});
// Recent searches logic
function saveRecentSearch(city) {
    let searches = JSON.parse(localStorage.getItem('recentWeatherSearches') || '[]');
    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    searches = searches.filter(c => c !== city); // Remove if already exists
    searches.unshift(city); // Add to front
    if (searches.length > 5) searches = searches.slice(0, 5);
    localStorage.setItem('recentWeatherSearches', JSON.stringify(searches));
    renderRecentSearches();
}

function renderRecentSearches() {
    let searches = JSON.parse(localStorage.getItem('recentWeatherSearches') || '[]');
    if (searches.length === 0) {
        recentSearchesDiv.innerHTML = '';
        return;
    }
    recentSearchesDiv.innerHTML = '<b>Recent:</b> ' + searches.map(city => `<button class="recent-btn" data-city="${city}">${city}</button>`).join(' ');
    document.querySelectorAll('.recent-btn').forEach(btn => {
        btn.onclick = () => {
            cityInput.value = btn.dataset.city;
            searchBtn.click();
        };
    });
}

// On load, render recent searches
renderRecentSearches();
// Style for recent search buttons
const style = document.createElement('style');
style.innerHTML = `
.recent-btn {
    background: #e3f2fd;
    border: none;
    border-radius: 6px;
    margin: 0 2px;
    padding: 4px 10px;
    font-size: 13px;
    cursor: pointer;
    color: #0288d1;
    transition: background 0.2s;
}
.recent-btn:hover {
    background: #4fc3f7;
    color: #fff;
}
.dark-theme .recent-btn {
    background: #2c2f34;
    color: #4fc3f7;
}
.dark-theme .recent-btn:hover {
    background: #0288d1;
    color: #fff;
}
`;
document.head.appendChild(style);

cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

function getWeather(city) {
    weatherResult.innerHTML = 'Loading...';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            weatherResult.innerHTML = `<span style="color:red;">${error.message}</span>`;
        });
}


function displayWeather(data) {
    const { name, sys, main, weather, wind } = data;
    function formatTime(unix, timezone) {
        // unix: seconds, timezone: seconds offset from UTC
        const date = new Date((unix + timezone) * 1000);
        return date.toUTCString().slice(-12, -4); // e.g. 05:32 PM
    }
    // Weather-based background and icon
    const weatherType = weather[0].main.toLowerCase();
    document.body.classList.remove(
        'weather-clear', 'weather-clouds', 'weather-rain', 'weather-thunderstorm', 'weather-snow', 'weather-mist', 'weather-drizzle', 'weather-haze', 'weather-fog', 'weather-smoke', 'weather-dust', 'weather-sand', 'weather-ash', 'weather-squall', 'weather-tornado'
    );
    let weatherClass = '';
    let weatherIcon = '';
    switch (weatherType) {
        case 'clear':
            weatherClass = 'weather-clear'; weatherIcon = '☀️'; break;
        case 'clouds':
            weatherClass = 'weather-clouds'; weatherIcon = '☁️'; break;
        case 'rain':
            weatherClass = 'weather-rain'; weatherIcon = '🌧️'; break;
        case 'thunderstorm':
            weatherClass = 'weather-thunderstorm'; weatherIcon = '⛈️'; break;
        case 'snow':
            weatherClass = 'weather-snow'; weatherIcon = '❄️'; break;
        case 'mist':
        case 'haze':
        case 'fog':
            weatherClass = 'weather-mist'; weatherIcon = '🌫️'; break;
        case 'drizzle':
            weatherClass = 'weather-drizzle'; weatherIcon = '🌦️'; break;
        case 'smoke':
            weatherClass = 'weather-smoke'; weatherIcon = '💨'; break;
        case 'dust':
        case 'sand':
        case 'ash':
            weatherClass = 'weather-dust'; weatherIcon = '🌪️'; break;
        case 'squall':
            weatherClass = 'weather-squall'; weatherIcon = '💨'; break;
        case 'tornado':
            weatherClass = 'weather-tornado'; weatherIcon = '🌪️'; break;
        default:
            weatherClass = 'weather-clear'; weatherIcon = '☀️'; break;
    }
    document.body.classList.add(weatherClass);
    weatherResult.innerHTML = `
        <strong>${name}, ${sys.country}</strong>
        <div>${weatherIcon} ${weather[0].main} - ${weather[0].description}</div>
        <div>🌡️ Temperature: <b>${main.temp}°C</b></div>
        <div>💧 Humidity: <b>${main.humidity}%</b></div>
        <div>💨 Wind Speed: <b>${wind.speed} m/s</b></div>
    `;
    // Move sunrise/sunset to below forecast
    const sunDetails = document.getElementById('sunDetails');
    sunDetails.innerHTML = `
        <span style="color:#0288d1; font-size:15px;">🌅 Sunrise: <b>${formatTime(sys.sunrise, data.timezone)}</b> &nbsp;|&nbsp; 🌇 Sunset: <b>${formatTime(sys.sunset, data.timezone)}</b></span>
    `;
}
// Theme toggle logic
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
let darkMode = false;

themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-theme', darkMode);
    themeIcon.textContent = darkMode ? '☀️' : '🌙';
});

function getForecast(city) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = 'Loading 5-day forecast...';
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast not found');
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            forecastDiv.innerHTML = `<span style="color:red;">${error.message}</span>`;
        });
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    // OpenWeatherMap 5-day forecast is every 3 hours, pick one per day (e.g., 12:00)
    const daily = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        const hour = item.dt_txt.split(' ')[1];
        if (hour === '12:00:00') {
            daily[date] = item;
        }
    });
    // If not enough 12:00:00, fill with closest
    if (Object.keys(daily).length < 5) {
        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!daily[date]) {
                daily[date] = item;
            }
        });
    }
    const days = Object.values(daily).slice(0, 5);
    if (days.length === 0) {
        forecastDiv.innerHTML = '<span style="color:red;">No forecast data available.</span>';
        return;
    }
    forecastDiv.innerHTML = days.map(item => {
        const d = new Date(item.dt_txt);
        const day = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        return `
            <div class="forecast-card">
                <strong>${day}</strong>
                <div>${item.weather[0].main}</div>
                <div><img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="icon" width="48"></div>
                <div>🌡️ ${item.main.temp}°C</div>
                <div>💧 ${item.main.humidity}%</div>
            </div>
        `;
    }).join('');
}
