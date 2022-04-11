function displayTemperature(response) {
    console.log(response.data);
    let temperatureElement = document.querySelector("#current-temperature");
    temperatureElement.innerHTML = Math.round(response.data.main.temp);
    let cityElement = document.querySelector("#city");
    cityElement.innerHTML = response.data.name;
    let descriptionElement = document.querySelector("#description");
    

}
let apiKey = "08e97ecdda5ea0cf3c620c610617c3ee";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=${apiKey}&units=metric`;

axios.get(apiUrl).then(displayTemperature);