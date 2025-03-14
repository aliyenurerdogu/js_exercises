document.getElementById('getWeatherButton').addEventListener('click', getWeather);

window.onload = () => {
    getWeather();
    loadPreviousWeather();
}
async function getWeather() {
    const city = document.getElementById('city').value;
    const apiKey = '50a4ee2644953270c63191074ca8f1ef';


    let url = '';

    if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        saveWeather(city);
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    updateWeatherData(data);

                } catch (error) {
                    console.error('Error fetching weather data:', error);
                }
            }, (err) => {
                console.warn(`ERROR(${err.code}): ${err.message}`);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
        return;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        updateWeatherData(data);

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};

updateWeatherData = (data) => {
    if (data.cod === 200) {
        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
        const humidityIcon = `images/humidity.png`;
        const windIcon = `images/windy.png`;

        document.getElementById('weatherIcon').textContent = iconUrl;
        document.getElementById('cityName').textContent = data.name;
        document.getElementById('temperature').textContent = `${data.main.temp}°C`;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('wind').textContent = `${data.wind.speed}m/s`;
        document.getElementById('weatherIcon').src = iconUrl;
        document.getElementById('humidityIcon').src = humidityIcon;
        document.getElementById('windIcon').src = windIcon;
        if (data.coord) {
            document.getElementById('weatherDetails').textContent =
                `Latitude: ${data.coord.lat}, Longitude: ${data.coord.lon}`;
        }
    } else {
        alert('city not found!');
    }
};