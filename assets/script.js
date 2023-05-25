const apiKey = "2b53fe9e9a97281c32a772fc33b1d0b7";

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const weatherContainer = document.getElementById('weather-container');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const location = searchInput.value.trim();
  if (location !== '') {
    getWeatherData(location);
    searchInput.value = '';
  }
});

function getWeatherData(location) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const weatherList = data.list.filter(item => item.dt_txt.includes('12:00:00'));
      displayWeatherData(weatherList);
      saveToLocalStorage(location, weatherList);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

function displayWeatherData(weatherList) {
  weatherContainer.innerHTML = '';
  weatherList.forEach((weather, index) => {
    const card = document.createElement('div');
    card.classList.add('weather-card');
    const date = new Date(weather.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const temperature = Math.round(weather.main.temp - 273.15);
    const windSpeed = weather.wind.speed;
    const humidity = weather.main.humidity;
    card.innerHTML = `
      <h2>${day}</h2>
      <p>Date: ${date.toLocaleDateString()}</p>
      <p>Temperature: ${temperature}°C</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
      <p>Humidity: ${humidity}%</p>
    `;
    card.style.animationDelay = `${index * 0.1}s`; // Add animation delay for each card
    weatherContainer.appendChild(card);
  });
}

function saveToLocalStorage(location, weatherList) {
  const savedData = {
    location: location,
    weatherList: weatherList
  };
  localStorage.setItem('weatherData', JSON.stringify(savedData));
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem('weatherData');
  if (savedData) {
    const { location, weatherList } = JSON.parse(savedData);
    displayWeatherData(weatherList);
  }
}

loadFromLocalStorage();
