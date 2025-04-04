document.getElementById('getWeatherButton').addEventListener('click', () => {
    const city = document.getElementById('city').value;
    if (city) {
        getWeather(city);
        saveSearchedCity(city); // Yeni şehir kaydedilecek
    }
});

document.getElementById('city').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const city = document.getElementById('city').value;
        if (city) {
            getWeather(city);
            saveSearchedCity(city);
        }
    }
});

// Sayfa yüklendiğinde önceki şehirleri göster
window.onload = () => {
    displaySearchedCities(); // Önceki şehirleri listele
    const lastCity = getLastSearchedCity();
    if (lastCity) {
        document.getElementById('city').value = lastCity;
        getWeather(lastCity);
    } else {
        getWeather();
    }
};

// **Hava Durumu API'sinden Verileri Getirme**
getWeather = async (city = null) => {
    const apiKey = '50a4ee2644953270c63191074ca8f1ef';

    if (!city) {
        city = document.getElementById('city').value;
    }

    // Şehri input alanına yazdır (🔹 Eklenen Kısım)
    document.getElementById('city').value = city;

    let url = '';

    if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        saveLastSearchedCity(city);  // Şehri kaydet
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
}

// **Hava Durumu Bilgilerini Güncelleme**
updateWeatherData = (data) => {
    if (data.cod === 200) {
        const weatherCondition = data.weather[0].main;
        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
        const humidityIcon = 'images/humidity.png';
        const windIcon = 'images/windy.png';

        document.getElementById('weatherIcon').src = iconUrl;
        document.getElementById('cityName').textContent = data.name;
        document.getElementById('temperature').textContent = `${data.main.temp}°C`;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('wind').textContent = `${data.wind.speed}m/s`;

        document.body.classList.remove("rainy", "sunny", "cloudy", "snowy", "foggy", "stormy", "lightning");

        if (weatherCondition.includes("Clear")) {
            document.body.classList.add("sunny");
        } else if (weatherCondition.includes("Rain") || weatherCondition.includes("Drizzle")) {
            document.body.classList.add("rainy");
        } else if (weatherCondition.includes("Clouds")) {
            document.body.classList.add("cloudy");
        } else if (weatherCondition.includes("Snow")) {
            document.body.classList.add("snowy");
        } else if (weatherCondition.includes("Mist") || weatherCondition.includes("Fog") || weatherCondition.includes("Haze") || weatherCondition.includes("Smoke")) {
            document.body.classList.add("foggy");
        } else if (weatherCondition.includes("Thunderstorm")) {
            document.body.classList.add("stormy");


            setTimeout(() => {
                document.body.classList.add("lightning");
                setTimeout(() => document.body.classList.remove("lightning"), 200);
            }, Math.random() * 5000);
        }
    } else {
        alert('City not found!');
    }
}

// **Son Aranan Şehri Local Storage'a Kaydet**
saveLastSearchedCity = (city) => {
    localStorage.setItem("lastCity", city);
}

// **Son Aranan Şehri Local Storage'dan Getir**
getLastSearchedCity = () => {
    return localStorage.getItem("lastCity");
}

// **🔹 Önceki Aranan Şehirleri Kaydet**
saveSearchedCity = (city) => {
    let searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];

    // Aynı şehir tekrar eklenmesin
    if (!searchedCities.includes(city)) {
        searchedCities.push(city);
        localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
    }

    displaySearchedCities(); // Güncellenmiş listeyi göster
}

// **🔹 Önceki Şehirleri Listele**
displaySearchedCities = () => {
    const searchedCitiesList = document.getElementById("searchedCitiesList");
    searchedCitiesList.innerHTML = ""; // Listeyi temizle

    let searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];

    // if (searchedCities.length === 0) {
    //     searchedCitiesContainer.style.display = "none";
    //     return;
    // } else {
    //     searchedCitiesContainer.style.display = "block";
    // }

    searchedCities.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.addEventListener("click", function () {
            getWeather(city); // 🔹 Şehrin hava durumunu getir
        });
        searchedCitiesList.appendChild(li);
    });
}

// **🔹 Önceki Şehirleri Temizleme (Opsiyonel)**
clearSearchedCities = () => {
    localStorage.removeItem("searchedCities");
    displaySearchedCities();
}
