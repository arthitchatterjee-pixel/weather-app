const apiKey = "72c05dbf9ca58ef24dfa51d5c53719d0"; 


const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const weatherIcon = document.getElementById("weatherIcon");
const forecastContainer = document.getElementById("forecast");
const loading = document.getElementById("loading");


searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});


cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});


locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoords(lat, lon);
            },
            () => {
                alert("Location access denied.");
            }
        );
    } else {
        alert("Geolocation not supported.");
    }
});


async function getWeather(city) {
    clearUI();

    try {
        loading.style.display = "block";

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();
        loading.style.display = "none";

        if (!response.ok) {
            alert(data.message);
            return;
        }

        updateWeatherUI(data);
        getForecast(city);

    } catch (error) {
        loading.style.display = "none";
        alert("Network error");
        console.log(error);
    }
}


async function getWeatherByCoords(lat, lon) {
    clearUI();

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        updateWeatherUI(data);
        getForecast(data.name);

    } catch (error) {
        alert("Error getting location weather.");
        console.log(error);
    }
}


function updateWeatherUI(data) {
    cityName.innerText = data.name;
    temperature.innerText = `🌡 Temperature: ${data.main.temp}°C`;
    description.innerText = `🌥 Weather: ${data.weather[0].description}`;
    humidity.innerText = `💧 Humidity: ${data.main.humidity}%`;
    wind.innerText = `🌬 Wind Speed: ${data.wind.speed} m/s`;

    
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.style.display = "block";

    
    const mainWeather = data.weather[0].main.toLowerCase();

    if (mainWeather.includes("cloud")) {
        document.body.style.background =
            "linear-gradient(to right, #bdc3c7, #2c3e50)";
    } else if (mainWeather.includes("rain")) {
        document.body.style.background =
            "linear-gradient(to right, #4b79a1, #283e51)";
    } else if (mainWeather.includes("clear")) {
        document.body.style.background =
            "linear-gradient(to right, #fceabb, #f8b500)";
    } else {
        document.body.style.background =
            "linear-gradient(to right, #4facfe, #00f2fe)";
    }
}


async function getForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        forecastContainer.innerHTML = "";

        
        const dailyData = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

        dailyData.slice(0, 5).forEach(day => {
            const div = document.createElement("div");
            div.classList.add("forecast-item");

            div.innerHTML = `
                <p><strong>${day.dt_txt.split(" ")[0]}</strong></p>
                <p>🌡 ${day.main.temp}°C</p>
                <p>${day.weather[0].description}</p>
            `;

            forecastContainer.appendChild(div);
        });

    } catch (error) {
        alert("Forecast error");
        console.log(error);
    }
}


function clearUI() {
    cityName.innerText = "";
    temperature.innerText = "";
    description.innerText = "";
    humidity.innerText = "";
    wind.innerText = "";
    forecastContainer.innerHTML = "";
    weatherIcon.style.display = "none";
}
