const API_KEY = "2b53fe9e9a97281c32a772fc33b1d0b7";
const searchForm = document.getElementById("city-search-form");
const searchInput = document.getElementById("city-search-input");
const cityNameEl = document.getElementById("city-name");
const searchHistoryList = document.getElementById("search-history-list");

// Get the weather data for a city
const getWeatherData = async (city) => {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`);
  const data = await res.json();
  return data;
};

// Display the 5 day forecast for a city
const displayForecast = (data) => {
  cityNameEl.textContent = data.city.name;

  const forecastEls = document.querySelectorAll(".forecast-day");
  for (let i = 0; i < forecastEls.length; i++) {
    const forecastEl = forecastEls[i];
    const date = new Date(data.list[i].dt * 1000).toLocaleDateString();
    const icon = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
    const temperature = data.list[i].main.temp;

    forecastEl.querySelector("h3").textContent = date;
    forecastEl.querySelector("img").src = icon;
    forecastEl.querySelector("img").alt = data.list[i].weather[0].description;
    forecastEl.querySelector("#temperature").textContent = temperature;
  }

  // Save the searched city to local storage
  localStorage.setItem("city", data.city.name);
  // Update the search history
  updateSearchHistory();
};

// Search for the weather data for a city
const searchWeather = async (event) => {
  event.preventDefault();
  const city = searchInput.value;

  const data = await getWeatherData(city);
  displayForecast(data);
};

searchForm.addEventListener("submit", searchWeather);

// Update the search history list
const updateSearchHistory = () => {
  // Get the existing search history from local storage
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Add the current city to the search history
  const currentCity = localStorage.getItem("city");
  if (currentCity && !searchHistory.includes(currentCity)) {
    searchHistory.push(currentCity);
  }

  // Clear the existing search history list
  searchHistoryList.innerHTML = "";

  // Add each search history item to the list
  searchHistory.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => {
      searchInput.value = city;
      searchWeather(new Event("submit"));
    });
    searchHistoryList.appendChild(li);
  });

  // Save the updated search history to local storage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
};

// Initialize the search history list
updateSearchHistory();

// Check if there is a city in local storage and search for its weather data
const city = localStorage.getItem("city");
if (city) {
  searchInput.value = city;
  searchWeather(new Event("submit"));
}
