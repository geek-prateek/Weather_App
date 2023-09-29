function convertToCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

function convertToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

let celsiusButtonEnabled = false;

function toggleTemperatureUnit(selectedUnit) {
  const currentTemperatureElement = document.querySelector(".temp");
  const currentTemperature = parseFloat(currentTemperatureElement.innerText);

  const celsiusButton = document.querySelector(
    ".unit-option[data-unit='celsius']"
  );
  const fahrenheitButton = document.querySelector(
    ".unit-option[data-unit='fahrenheit']"
  );

  if (selectedUnit === "celsius") {
    if (celsiusButtonEnabled) {
      const celsiusTemperature = convertToCelsius(currentTemperature);
      currentTemperatureElement.innerText =
        celsiusTemperature.toFixed(2) + " °C";
      celsiusButtonEnabled = false;
      celsiusButton.disabled = true;
      fahrenheitButton.disabled = false;
    }
  } else {
    if (!celsiusButtonEnabled) {
      const fahrenheitTemperature = convertToFahrenheit(currentTemperature);
      currentTemperatureElement.innerText =
        fahrenheitTemperature.toFixed(2) + " °F";
      celsiusButtonEnabled = true;
      celsiusButton.disabled = false;
      fahrenheitButton.disabled = true;
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const celsiusButton = document.querySelector(
    ".unit-option[data-unit='celsius']"
  );
  const fahrenheitButton = document.querySelector(
    ".unit-option[data-unit='fahrenheit']"
  );

  celsiusButton.disabled = true;
  fahrenheitButton.disabled = false;

  let weather = {
    apiKey: "adad1211d7c2684d28473963500ae610",
    fetchWeather: function (city) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
      )
        .then((response) => {
          if (!response.ok) {
            alert("City spelling is incorrect! Please try with correct one");
            throw new Error("API Fetching error");
          }
          return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
    defaultBackgroundImage:
      "url('https://img.freepik.com/free-vector/blue-cloudy-daylight-background-weather-design_33099-512.jpg')",
    displayWeather: function (data) {
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;

      const backgroundImageUrl = `https://source.unsplash.com/1600x900/?${name}`;
      const imageExists = (url, callback) => {
        const img = new Image();
        img.onload = () => callback(true);
        img.onerror = () => callback(false);
        img.src = url;
      };
      imageExists(backgroundImageUrl, (exists) => {
        if (exists) {
          document.body.style.backgroundImage = `url('${backgroundImageUrl}')`;
        } else {
          document.body.style.backgroundImage = weather.defaultBackgroundImage;
        }
      });
      document.querySelector(".city").innerText = name;
      document.querySelector(
        ".icon"
      ).src = `https://openweathermap.org/img/wn/${icon}.png`;
      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerText = temp + " °C";
      document.querySelector(".humidity").innerText = humidity + " %";
      document.querySelector(".wind").innerText = speed + " km/h";
      document.querySelector(".weather").classList.remove("loading");
    },

    fetchWeatherByCoordinates: function (latitude, longitude) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`
      )
        .then((response) => {
          if (!response.ok) {
            alert("Unable to fetch weather data!");
            throw new Error("API Fetching error");
          }
          return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
    search: function (city) {
      if (!city && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          this.fetchWeatherByCoordinates(latitude, longitude);
        });
      } else {
        this.fetchWeather(city);
      }
    },
  };

  document
    .querySelector(".search button")
    .addEventListener("click", function () {
      const cityName = document.querySelector(".search-bar").value;
      weather.search(cityName);
    });

  document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        const cityName = document.querySelector(".search-bar").value;
        weather.search(cityName);
      }
    });

  const location = document.querySelector(".loc");

  location.addEventListener("click", function () {
    weather.search();
  });
});
