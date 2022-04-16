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

function formatForecastDay(timestamp) {
    let date = new Date(timestamp *1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];


    return days[day];
}

function displayForecast(response) {
    let forecast = response.data.daily;
    let forecastElement = document.querySelector("#forecast");

    let forecastHTML = `<div class = "row">`;
    
    forecast.forEach(function (forecastDay, index) {
        if (index < 6) {
    forecastHTML = 
        forecastHTML + 
    `
    <div class = "col-2">
        <div class = "weather-forecast-date">${formatForecastDay(forecastDay.dt)}</div>
        ${index}    
        <img
                src = "http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
                alt=""
                width="42" />
            <div class="weather-forecast-temperatures">
                <span class = "weather-forecast-temperature-max">
                ${Math.round(forecastDay.temp.max)}°</span>
                <span class = "weather-forecast-temperature-min">
                ${Math.round(forecastDay.temp.min)}°</span>
        </div> 
    </div>`;
        }
    });
forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates){
    console.log(coordinates);
    let apiKey = "08e97ecdda5ea0cf3c620c610617c3ee";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
    celsiusTemp = response.data.main.temp;
    let temperatureElement = document.querySelector("#current-temperature");
    temperatureElement.innerHTML = Math.round(celsiusTemp);
    let cityElement = document.querySelector("#city");
    cityElement.innerHTML = response.data.name;
    let descriptionElement = document.querySelector("#description");
    descriptionElement.innerHTML = response.data.weather[0].description;
    let humidityElement = document.querySelector("#humidity");
    humidityElement.innerHTML = response.data.main.humidity;
    let windElement = document.querySelector("#wind");
    windElement.innerHTML = Math.round(response.data.wind.speed);
    let dateElement = document.querySelector("#date");
    dateElement.innerHTML = formatDate(response.data.dt * 1000);
    let iconElement = document.querySelector("#icon");
    iconElement.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    iconElement.setAttribute("alt", response.data.weather[0].description);

    getForecast(response.data.coord);
}



function search(city) {

    let apiKey = "08e97ecdda5ea0cf3c620c610617c3ee";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
    event.preventDefault();
    let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function displayFahrenheitTemp(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector("#current-temperature");
    
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
    let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
    temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}
 function displayCelsiusTemp(event) {
     event.preventDefault();
     celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
     let temperatureElement = document.querySelector("#current-temperature");
     temperatureElement.innerHTML = Math.round(celsiusTemp);
 }


let celsiusTemp = null;


let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);

search("Paris");