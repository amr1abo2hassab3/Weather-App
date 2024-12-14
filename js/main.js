const iconNavLinks = document.querySelector(".icon-nav-links");
const navLinks = document.querySelector(".nav-links");

// toggle navBar
iconNavLinks.addEventListener("click", function () {
  navLinks.classList.toggle("toggleNav");
  this.classList.toggle("activeBtn");
});

async function getWeather(location = "") {
  let apiURL = `https://api.weatherapi.com/v1/forecast.json?key=3d6c23c06def46a2bf0214654241212&q=${
    location || "auto:ip"
  }&days=3`;

  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    const city = data.location.name;
    const country = data.location.country;
    const current = data.current;

    document.getElementById("cityName").textContent = `${country}, ${city}`;
    document.getElementById("currentDay").textContent = new Date(
      data.location.localtime
    ).toLocaleDateString("en-US", { weekday: "long" });
    document.getElementById("currentDate").textContent = new Date(
      data.location.localtime
    ).toLocaleDateString();
    document.getElementById("currentTemp").textContent = `${current.temp_c}°C`;
    document.getElementById("currentCondition").textContent =
      current.condition.text;
    document.getElementById("humidity").textContent = `${current.humidity}%`;
    document.getElementById(
      "windSpeed"
    ).textContent = `${current.wind_kph} km/h`;
    document.getElementById("windDirection").textContent = current.wind_dir;

    data.forecast.forecastday.forEach((day, index) => {
      if (index === 0) return;
      const dayName = new Date(day.date).toLocaleDateString("en-US", {
        weekday: "long",
      });
      const maxTemp = day.day.maxtemp_c;
      const minTemp = day.day.mintemp_c;
      const condition = day.day.condition.text;

      document.getElementById(`forecastDay${index}`).textContent = dayName;
      document.getElementById(
        `forecastTemp${index}`
      ).textContent = `${maxTemp}°C`;
      document.getElementById(
        `forecastMinTemp${index}`
      ).textContent = `${minTemp}°C`;
      document.getElementById(`forecastCondition${index}`).textContent =
        condition;
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function getLocationAndWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeather(`${lat},${lon}`);
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        getWeather();
      }
    );
  } else {
    getWeather();
  }
}

document.getElementById("locationInput").addEventListener("input", (e) => {
  const location = e.target.value.trim();
  if (location) {
    getWeather(location);
  } else {
    getLocationAndWeather();
  }
});

getLocationAndWeather();
