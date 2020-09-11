navigator.serviceWorker && navigator.serviceWorker.register('./sw.js').then(function(registration) {
  console.log('Excellent, registered with scope: ', registration.scope);
});

var weatherData = {
  city: document.querySelector ("#city"),
  weather: document.querySelector ("#weather"),
  temperature: document.querySelector("#temperature"),
  dt: document.querySelector("#dt"),
  wind: document.querySelector("#wind"),
  humidity: document.querySelector("#humidity"),
  icon: document.querySelector("#condition"),
  forecast: document.querySelector("#forecast"),
  temperatureValue: 0,
  units: "°F",

  //Mobile
  city2: document.querySelector ("#city2"),
  weather2: document.querySelector ("#weather2"),
  temperature2: document.querySelector("#temperature2"),
  dt2: document.querySelector("#dt2"),
  detail: document.querySelector("#detail"),
  icon2: document.querySelector("#condition2"),
  forecast2: document.querySelector("#forecast2"),

};

var forecast = [];

function roundTemperature(temperature){
			temperature = temperature.toFixed(1);
			return temperature;
}

function switchUnits (){

  if (weatherData.units == "°C") {
    weatherData.temperatureValue = roundTemperature(weatherData.temperatureValue * 9/5 + 32);
    weatherData.units = "°F";
    toFahrenheit();

} else {
  weatherData.temperatureValue = roundTemperature ((weatherData.temperatureValue -32) * 5/9);
    weatherData.units = "°C";
    toCelsius();
}

  weatherData.temperature.innerHTML = weatherData.temperatureValue + weatherData.units + " ";
  weatherData.temperature2.innerHTML = weatherData.temperatureValue + weatherData.units + " ";
}


function getLocationAndWeather(city,lat,lon){
  if (window.XMLHttpRequest){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
      var response = JSON.parse(xhr.responseText);
      localStorage.setItem('weather', JSON.stringify(response));
      var position = {
        latitude: response.lat,
        longitude: response.lon
      };
      var cityName = city;
      var current = response.current;
      var daily = response.daily;
      var dt = new Date(current.dt * 1000).toString().split(' ');
      var weatherSimpleDescription = current.weather[0].main;
      var weatherDescription = current.weather[0].description;
      var weatherTemperature = roundTemperature(current.temp);
      var weatherWind = 'Wind: ' + current.wind_speed + ' m/s';
      var weatherHumidity = 'Humidity: ' + current.humidity + '%';
      var weatherDt = fullDay(dt[0]) + ' ' + dt[4].substring(0, 5);

      weatherData.temperatureValue = weatherTemperature;

      loadBackground(position.latitude, position.longitude, weatherSimpleDescription);
      weatherData.wind.innerHTML =  weatherWind;
      weatherData.humidity.innerHTML =  weatherHumidity;
      weatherData.dt.innerHTML =  weatherDt;
      weatherData.weather.innerHTML =  ", " + weatherDescription;
      weatherData.temperature.innerHTML = weatherTemperature + weatherData.units;
      weatherData.detail.innerHTML =  weatherWind + ' ' + weatherHumidity;
      weatherData.dt2.innerHTML =  weatherDt;
      weatherData.weather2.innerHTML =  ", " + weatherDescription;
      weatherData.temperature2.innerHTML = weatherTemperature + weatherData.units;
      switch (current.weather[0].icon) {
        case '01d':
          weatherData.city.innerHTML = cityName + " <i id='condition' class='wi wi-day-sunny'>"
          weatherData.city2.innerHTML = cityName + " <i id='condition' class='wi wi-day-sunny'>"
          break;
        case '02d':
          weatherData.city.innerHTML = cityName + " <i id='condition' class='wi wi-day-sunny-overcast'>"
          weatherData.city2.innerHTML = cityName + " <i id='condition' class='wi wi-day-sunny-overcast'>"
          break;
        case '01n':
          weatherData.city.innerHTML = cityName + " <i id='condition' class='wi wi-night-clear'>"
          weatherData.city2.innerHTML = cityName + " <i id='condition' class='wi wi-night-clear'>"
          break;
        case '02n':
          weatherData.city.innerHTML = cityName + " <i id='condition' class='wi wi-night-clear-cloudy'>"
          weatherData.city2.innerHTML = cityName + " <i id='condition' class='wi wi-night-clear-cloudy'>"
          break;
      }

      switch (current.weather[0].icon.substr(0, 2)) {
        case '03':
          weatherData.city.innerHTML = cityName + " <i id='condition' class='wi wi-cloud'>"
          weatherData.city2.innerHTML = cityName + " <i id='condition' class='wi wi-cloud'>"
          break;
        case '04':
          weatherData.city.innerHTML = cityName + " <i id='condition' class='wi wi-cloudy'>"
          weatherData.city2.innerHTML = cityName + " <i id='condition' class='wi wi-cloudy'>"
          break;
        case '09':
          weatherData.city.innerHTML = cityName + " <i id='condition' class='wi wi-showers'>"
          weatherData.city2.innerHTML = cityName + " <i id='condition' class='wi wi-showers'>"
          break;
        case '10':
          weatherData.city.innerHTML = cityName + " <i id='condition' class='wi wi-rain'>"
          weatherData.city2.innerHTML = cityName + " <i id='condition' class='wi wi-rain'>"
          break;
        case '11':
          weatherData.city.innerHTML = cityName + " <i id='condition' class='wi wi-thunderstorm'>"
          weatherData.city2.innerHTML = cityName + " <i id='condition' class='wi wi-thunderstorm'>"
          break;
        case '13':
          weatherData.city.innerHTML = cityName + " <i id='condition' class='wi wi-snow'>"
          weatherData.city2.innerHTML = cityName + " <i id='condition' class='wi wi-snow'>"
          break;
        case '50':
          weatherData.city.innerHTML = cityName + " <i id='condition' class='wi wi-day-fog'>"
          weatherData.city2.innerHTML = cityName + " <i id='condition' class='wi wi-day-fog'>"
          break;
      }

      // forecast
      var length = daily.length;
      for (var i = 1; i < length; i++) {
        forecast.push({
          date: new Date(daily[i].dt * 1000).toString().split(' ')[0],
          fahrenheit: {
            high: Math.round(daily[i].temp.max),
            low: Math.round(daily[i].temp.min),
          },
          celsius: {
            high: Math.round((daily[i].temp.max - 32) * (5 / 9)),
            low: Math.round((daily[i].temp.min - 32) * (5 / 9))
          }
        });
      }

      doForecast('fahrenheit');


    }, false);

    xhr.addEventListener("error", function(err){
      alert("Could not complete the request");
    }, false);

    xhr.open("GET", "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly&units=imperial&appid=58fe91792ee19646d344e183f81b03de", true);
    xhr.send();
  }
  else{
    alert("Unable to fetch the location and weather data.");
  }
}


function loadBackground(lat, lon, weatherTag) {
  var script_element = document.createElement('script');

  script_element.src = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1452866c8cea54acd0075022ef573a07&lat=" + lat + "&lon=" + lon + "&accuracy=1&tags=" + weatherTag + "&sort=relevance&extras=url_l&format=json";

  document.getElementsByTagName('head')[0].appendChild(script_element);
}

function jsonFlickrApi(data){
  if (data.photos.pages > 0){
    //var randomPhotoId = parseInt(data.photos.total);
    var photo = data.photos.photo[Math.floor(Math.random()*parseInt(data.photos.photo.length))];
    document.querySelector("body").style.backgroundImage = "url('" + photo.url_l + "')";
    document.querySelector("#image-source").setAttribute("href", "http://www.flickr.com/photos/" + photo.owner + "/" + photo.id);
  }
  else{
    document.querySelector("body").style.backgroundImage = "url('https://fourtonfish.com/tutorials/weather-web-app/images/default.jpg')";
    document.querySelector("#image-source").setAttribute("href", "https://www.flickr.com/photos/superfamous/310185523/sizes/o/");
  }
}

function fullDay(str) {
  switch (str) {
    case 'Tue':
      return 'Tuesday';
    case 'Wed':
      return 'Wednesday';
    case 'Thu':
      return 'Thursday';
    case 'Sat':
      return 'Saturday';
    default:
      return str + 'day';
  }
}

function toCelsius() {
  doForecast('celsius');
}

function toFahrenheit() {
  doForecast('fahrenheit');
}

function doForecast(unit) {
  var arr = [];
  var length = forecast.length;
  for (var i = 0; i < length; i++) {
    arr[i] = ("<div class='block'><h3 class='secondary'>" + forecast[i].date + "</h3><h2 class='high'>" + forecast[i][unit].high + "</h2><h4 class='secondary'>" + forecast[i][unit].low + "</h4></div>");
  }
  weatherData.forecast.innerHTML = arr.join('');
  weatherData.forecast2.innerHTML = arr.join('');
}

function getLocation(input) {
  forecast = [];
  if (window.XMLHttpRequest){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
      var response = JSON.parse(xhr.responseText);
      localStorage.setItem('location', JSON.stringify(response));
      var coord = response.coord;
      var cityName = response.name;
      getLocationAndWeather(cityName, coord.lat, coord.lon);
    }, false);
    xhr.open("GET", "https://api.openweathermap.org/data/2.5/weather?q="+ input + "&appid=58fe91792ee19646d344e183f81b03de", true);
    xhr.send();
  } else{
    alert("Unable to fetch the location and weather data.");
  }

}

function submit(id) {
  var input = document.getElementById(id).value;
  var inputLength = input.length;
  if (inputLength) getLocation(input);
}

//getLocationAndWeather();
