// Function to format the date and time
function formatDate(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[date.getDay()];
    return `${day} ${hours}:${minutes}`;
}

// Function to format forecast days
function formatForecastDay(timestamp) {
    let date = new Date(timestamp * 1000); // Convert UNIX timestamp to milliseconds
    let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    return days[date.getDay()];
}

// Function to display forecast data
function displayForecast(response) {
    let forecast = response.daily;
    let forecastElement = document.querySelector("#forecast");

    let forecastHTML = `<div class="row">`;
    forecast.forEach(function (forecastDay, index) {
        if (index < 6) { // Limit to 6 days
            forecastHTML += `
                <div class="col-2">
                    <div class="weather-forecast-date">${formatForecastDay(forecastDay.dt)}</div>    
                    <img
                        src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
                        alt="${forecastDay.weather[0].description}"
                        width="42" />
                    <div class="weather-forecast-temperatures">
                        <span class="weather-forecast-temperature-max">${Math.round(forecastDay.temp.max)}°</span>
                        <span class="weather-forecast-temperature-min">${Math.round(forecastDay.temp.min)}°</span>
                    </div> 
                </div>`;
        }
    });
    forecastHTML += `</div>`;
    forecastElement.innerHTML = forecastHTML;
}

// Function to display the current weather
function displayTemperature(response) {
    let temperatureElement = document.querySelector("#current-temperature");
    temperatureElement.innerHTML = Math.round(response.main.temp);

    let cityElement = document.querySelector("#city");
    cityElement.innerHTML = response.name;

    let descriptionElement = document.querySelector("#description");
    descriptionElement.innerHTML = response.weather[0].description;

    let humidityElement = document.querySelector("#humidity");
    humidityElement.innerHTML = response.main.humidity;

    let windElement = document.querySelector("#wind");
    windElement.innerHTML = Math.round(response.wind.speed);

    let dateElement = document.querySelector("#date");
    dateElement.innerHTML = formatDate(response.dt * 1000);

    let iconElement = document.querySelector("#icon");
    iconElement.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
    );
    iconElement.setAttribute("alt", response.weather[0].description);

    // Optionally, call a forecast API if available
    // getForecast(response.coord);
}

// Function to fetch weather data via the Flask backend
function search(city) {
    const apiUrl = `http://localhost:5000/api/weather?city=${city}`; // Flask backend endpoint
    axios
        .get(apiUrl)
        .then(response => displayTemperature(response.data))
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("Could not fetch weather data. Please try again.");
        });
}

// Event handler for the search form
function handleSubmit(event) {
    event.preventDefault();
    const cityInputElement = document.querySelector("#city-input");
    search(cityInputElement.value);
}

// Event listeners for Fahrenheit and Celsius conversions
function displayFahrenheitTemp(event) {
    event.preventDefault();
    const temperatureElement = document.querySelector("#current-temperature");

    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");

    let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
    temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

function displayCelsiusTemp(event) {
    event.preventDefault();
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");

    const temperatureElement = document.querySelector("#current-temperature");
    temperatureElement.innerHTML = Math.round(celsiusTemp);
}

// Global variable for temperature in Celsius
let celsiusTemp = null;

// Event listeners for the form and links
const form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

const fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

const celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);

// Default city search
search("Paris");
