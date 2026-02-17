const apiKey = "72c05dbf9ca58ef24dfa51d5c53719d0";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value;
    getWeather(city);
});

async function getWeather(city) {
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

        cityName.innerText = data.name;
        temperature.innerText = `🌡 Temperature: ${data.main.temp}°C`;
        description.innerText = `🌥 Weather: ${data.weather[0].description}`;
        humidity.innerText = `💧 Humidity: ${data.main.humidity}%`;
        wind.innerText = `🌬 Wind Speed: ${data.wind.speed} m/s`;

        // Weather Icon
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.style.display = "block";

        // Background change
        const mainWeather = data.weather[0].main.toLowerCase();

        if (mainWeather.includes("cloud")) {
            document.body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
        } 
        else if (mainWeather.includes("rain")) {
            document.body.style.background = "linear-gradient(to right, #4b79a1, #283e51)";
        } 
        else if (mainWeather.includes("clear")) {
            document.body.style.background = "linear-gradient(to right, #fceabb, #f8b500)";
        } 
        else {
            document.body.style.background = "linear-gradient(to right, #4facfe, #00f2fe)";
        }

    } catch (error) {
        loading.style.display = "none";
        alert("Network error");
        console.log(error);
    }
}
