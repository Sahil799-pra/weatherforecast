const form = document.querySelector(".weather");
const input = document.querySelector("input");
const weatherCard = document.getElementById("weatherCard");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const city = input.value.trim();
    const apiKey = "20391d782307a1e0f77d10cf28d93167";

    if (!city) {
        showError("Please enter a city name");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        if (data.cod == 200) {
            displayWeather(data);
            input.value = "";
            errorMsg.textContent = "";
            errorMsg.classList.remove("show");
        } else {
            showError(data.message || "City not found");
        }

    } catch (error) {
        showError("Error fetching data. Please try again.");
        console.error(error);
    }
});

function displayWeather(data) {
    // Main weather info
    document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("weatherDesc").textContent = data.weather[0].description;
    
    // Details
    document.getElementById("feelsLike").textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("windSpeed").textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
    document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;
    document.getElementById("visibility").textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    
    // UV Index (using a simple estimation based on available data)
    const uvEstimate = data.clouds ? Math.max(0, 10 - Math.floor(data.clouds.all / 20)) : 5;
    document.getElementById("uvIndex").textContent = uvEstimate;
    
    // Show the weather card
    weatherCard.style.display = "block";
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add("show");
    weatherCard.style.display = "none";
}
