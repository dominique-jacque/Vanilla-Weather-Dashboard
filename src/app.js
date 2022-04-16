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
    let apiKey = "18964e1a368b48cfa68231522221604";
    let apiUrl = `http://api.weatherapi.com/v1/forecast.json?lat=${coordinates.lat}&lon=${coordinates.lon}key=${apiKey}&q=Paris&days=5`
    
    axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
    FahrenheitTemp = response.data.current.temp_f;
    let temperatureElement = document.querySelector("#current-temperature");
    temperatureElement.innerHTML = Math.round(fahreneitTemp);
    let cityElement = document.querySelector("#city");
    cityElement.innerHTML = response.data.location.name;
    let descriptionElement = document.querySelector("#description");
    descriptionElement.innerHTML = response.data.current.condition[0].text;
    let humidityElement = document.querySelector("#humidity");
    humidityElement.innerHTML = response.data.current.humidity;
    let windElement = document.querySelector("#wind");
    windElement.innerHTML = Math.round(response.data.current.wind_mph);
    let dateElement = document.querySelector("#date");
    dateElement.innerHTML = formatDate(response.data.localtime);
    let iconElement = document.querySelector("#icon");
    iconElement.setAttribute(
        "src",
        `//cdn.weatherapi.com/weather/64x64/night/113.png`
    );
    iconElement.setAttribute("alt", response.data.weather[0].description);

    getForecast(response.data.coord);
}



function search(city) {

    let apiKey = "18964e1a368b48cfa68231522221604";
    let apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Paris&units=metric`;
    axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
    event.preventDefault();
    let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}


let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);



search("Paris");