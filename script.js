import weaCode from '/weather_desc.json' assert {type: 'json'};
import weacodeicons from 'Weather_Code_Icons/weather_desc_img.json' assert {type: 'json'};
const locationName = document.querySelector(".search-bar #location-name");
function fetchWeather() {
  const todayDate = document.querySelector('#today'),
  
  cityName = document.querySelector(".search-bar #location-name").value,
    current_temp = document.querySelector('.current #current-temp'),
    weatherDesc = document.querySelector('.suggestions #current-temp-desc'),
    weeklyMax_Min = document.querySelectorAll(".max-min span"),
    daily_temp_details = document.querySelectorAll(".right-hero-section .items .temp-data span"),
    weeklyDays = document.querySelectorAll(".daily-forecast-days"),
    hourForecast = document.querySelectorAll(".time-forecast-cards .time-title"),
    hourly_forecast_humidity = document.querySelectorAll(".time-forecast-cards .hourly-humidity span"),
    hourly_forecast_temp = document.querySelectorAll(".time-forecast-cards .hourly-temp"),
    current_Time = document.querySelector(".right-hero-section .world-time #current-time"),
    current_location = document.querySelector(".location #location-details"),
    icons = document.querySelector(".weather-conditions-icons #toggleIcons"),
    forecast_weather_icons = document.querySelectorAll(".daily-forecast-cards .forecast_desc_icons")
    ;
  let checkTime, weatherCode;

  let date = new Date();
  function displayDate() {
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday",];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    todayDate.innerHTML = `${weekDays[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()},${date.getFullYear()}`;
  }
  function dayofWeek() {
    const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDate = new Date();
    const weeklyDays_arr = [];

    for (let i = 0; i <= 6; i++) {
      const dayOfWeek = (currentDate.getDay() + i) % 7;
      weeklyDays_arr.push(dayName[dayOfWeek]);
    }
    for (let i = 1; i <= 4; i++) {
      weeklyDays[i].innerHTML = weeklyDays_arr[i]
    }
  }

  fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${cityName}&apikey=0k0k4QBmHVzTLvtU4XqlO0UsQLPHzmPk`)
    .then(response => response.json())
    .then(data => {
      //today's date
      displayDate();
      //current temperature
      current_temp.innerHTML = Math.round(data.timelines.daily[0].values.temperatureAvg) + "°";
      //hourly humidity
      function hourlyHumidity() {
        for (let i = 0; i <= 2; i++) {
          hourly_forecast_humidity[i].innerHTML = Math.round(data.timelines.hourly[i].values.humidity) + " %";
        }
      }
      hourlyHumidity();
      //hourly temperature
      function hourlyTemp() {
        for (let i = 0; i <= 2; i++) {
          hourly_forecast_temp[i].innerHTML = Math.round(data.timelines.hourly[i].values.temperature) + "°";
        }
      }
      hourlyTemp();
      //daily max and min temperature
      function week_day_maxMin() {
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 2; j++) {

            if (j === 0) {
              weeklyMax_Min[i * 2].innerHTML = Math.round(data.timelines.daily[i + j].values.temperatureMax) + "°" + " ";
            } else {
              weeklyMax_Min[i * 2 + 1].innerHTML = Math.round(data.timelines.daily[i * j].values.temperatureMin) + "°";
            }
          }
        }
      }
      week_day_maxMin();
      weatherCode = data.timelines.daily[0].values.weatherCodeMax;

      function dayTime() {
        let weather_daycode = weatherCode + "0";
        let weather_code = weaCode.weatherCodeDay[weather_daycode];
        weatherDesc.innerHTML = weather_code;
        let weather_code_icons = weacodeicons.DayWeatherCodeIcons[weather_daycode];
        icons.src = `${weather_code_icons}`;
        for (let i = 0; i <= 4; i++) {
          forecast_weather_icons[i].src = `${weacodeicons.DayWeatherCodeIcons[data.timelines.daily[i].values.weatherCodeMax + "0"]}`;
        }
        if (weather_daycode == 10000) {
          document.documentElement.style.setProperty("--primary", "#63a6f2")
          document.documentElement.style.setProperty("--secondary", "#7cb7f7")
        }
      }
      function nightTime() {
        let weather_nightcode = weatherCode + "1";
        let weather_code = weaCode.weatherCodeNight[weather_nightcode];
        weatherDesc.innerHTML = weather_code;
        let weather_code_icons = weacodeicons.NightWeatherCodeIcons[weather_nightcode];
        icons.src = `${weather_code_icons}`;
        for (let i = 0; i <= 4; i++) {
          forecast_weather_icons[i].src = `${weacodeicons.DayWeatherCodeIcons[data.timelines.daily[i].values.weatherCodeMax + "0"]}`;
        }
        document.documentElement.style.setProperty("--primary", "#6d6e84")
        document.documentElement.style.setProperty("--secondary", "#545666")

      }
      //hourly forecast time and setting timezone according to searched city
      let lat = data.location.lat;
      let long = data.location.lon;
      fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=2OTWCICTC71U&format=json&by=position&lat=${lat}&lng=${long}`)
        .then(response => response.json())
        .then(data => {
          let formattedTime = new Date(data.formatted);
          current_Time.innerHTML = formattedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
          checkTime = formattedTime.getHours();
          // console.log(checkTime)
          if (checkTime >= 21) {
            nightTime();
          } else {
            dayTime();
          }
          current_location.innerHTML = data.cityName + "," + data.regionName;
          for (let i = 0; i <= 2; i++) {
            let timeAfter = new Date(formattedTime.getTime() + i * 60 * 60 * 1000);
            let minutes = timeAfter.getMinutes();
            if (minutes < 30) {
              minutes = 30;
            } else if (minutes > 30 && minutes < 45) {
              minutes = 45;
            } else {
              minutes = 0;
            }
            timeAfter.setMinutes(minutes);
            if (minutes == 0) {
              hourForecast[i].innerHTML = timeAfter.toLocaleTimeString([], { hour: 'numeric', hour12: true });
            } else {
              hourForecast[i].innerHTML = timeAfter.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            }
          }

        })


      //displaying days after today
      dayofWeek();
      //displaying daily weather icons

      //daily max and min temperature
      function today_max_min() {
        //today's max
        daily_temp_details[0].innerHTML = Math.round(data.timelines.daily[0].values.temperatureMin) + "°" + "/";
        //today's min
        daily_temp_details[1].innerHTML = Math.round(data.timelines.daily[0].values.temperatureMax) + "°";
        //today's feels-like
        daily_temp_details[2].innerHTML = Math.round(data.timelines.daily[0].values.temperatureApparentAvg) + "°";
        //today's uv index
        let uv_index = data.timelines.daily[0].values.uvIndexMax;
        if (uv_index <= 2) {
          daily_temp_details[3].innerHTML = "Low";
        } else if (uv_index >= 3 && uv_index <= 5) {
          daily_temp_details[3].innerHTML = "Moderate";
        } else if (uv_index >= 6 && uv_index <= 7) {
          daily_temp_details[3].innerHTML = "High";
        } else if (uv_index >= 8 && uv_index <= 10) {
          daily_temp_details[3].innerHTML = "Very High";
        } else {
          daily_temp_details[3].innerHTML = "Extreme";
        }
        //today's humidity
        daily_temp_details[4].innerHTML = Math.round(data.timelines.daily[0].values.humidityAvg) + " %";
        //today's wind speed
        daily_temp_details[5].innerHTML = Math.round(data.timelines.daily[0].values.windSpeedAvg) + " km/hr";
        //today's air pressure
        daily_temp_details[6].innerHTML = Math.round(data.timelines.daily[0].values.pressureSurfaceLevelAvg) + " hPa";
      }
      today_max_min();
      //current location


    })
}

locationName.addEventListener("keyup", e => e.key === "Enter" && fetchWeather());
// function onWindowLoad() {
//   // Check if the input field is empty
//   if (cityName === '') {
//     // Call the function with the first parameter
//     navigator.geolocation.getCurrentPosition(
//           position => {
//             const { latitude, longitude } = position.coords; // Get coordinates of user location
//             fetchWeather(`${latitude},${longitude}`);
//   })
// }
// }
// // Function to be called when the enter key is pressed
// function onEnterKeyPress(event) {
//   // Check if the enter key is pressed
//   if (event.key === "Enter") {
//     // Call the function with the second parameter
//     fetchWeather(cityName)
//   }
// }


// // Add event listeners
// window.addEventListener('load', onWindowLoad);
// locationName.addEventListener('keypress', onEnterKeyPress);
