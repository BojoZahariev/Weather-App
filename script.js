const apiKey = '3aab69399bf03eca438758bf6e33d18e';
const buttonSubmit = document.getElementById('submit');
const cityInput = document.getElementById('input1');
const countryInput = document.getElementById('input2');
const city = document.getElementById('city');
const description = document.getElementById('description');
const temp = document.getElementById('temp');
const tempMin = document.getElementById('temp-min');
const tempMax = document.getElementById('temp-max');
const wind = document.getElementById('wind');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const todayHourlyDiv = document.getElementById('today-hourly');
const todayHourlyElement = document.getElementsByClassName('today-part');
const forecastDiv = document.getElementById('forecast');
const forecastElement = document.getElementsByClassName('forecast-part');
const backToToday = document.getElementById('back-to-today');
const validPlace = document.getElementById('validPlace');

cityInput.value = 'Leeds';
countryInput.value = 'GB';

//get the data from the local storage if it's not empty
if (localStorage.length !== 0) {
  cityInput.value = localStorage.getItem('city');
  countryInput.value = localStorage.getItem('country');
}

//today's weather
const getTodayData = async (cityName, country) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${country}&units=metric&appid=${apiKey}`,
      {
        mode: 'cors'
      }
    );
    const fetchedData = await response.json();

    console.log(fetchedData);

    //send the data to be displayed
    displayToday(fetchedData);
  } catch (err) {
    validPlace.style.display = 'block';
  }
};

const get5dayHourlyData = async (cityName, country) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},${country}&units=metric&appid=${apiKey}`,
      {
        mode: 'cors'
      }
    );
    const fetchedData = await response.json();

    console.log(fetchedData);
    displayTodayHourly(fetchedData, 0);
    getIndex(fetchedData);
    displayNext4days(fetchedData, getIndex(fetchedData));
  } catch (err) {
    validPlace.style.display = 'block';
  }
};

//get the index of the next day, start 03:00:00
const getIndex = apiData => {
  let newDayIndex;

  for (let i = 0; i < apiData.list.length; i++) {
    if (apiData.list[i].dt_txt.includes('03:00:00')) {
      newDayIndex = i;
      break;
    }
  }
  return newDayIndex;
};

//display the data for Today
const displayToday = apiData => {
  city.textContent = apiData.name;
  //rounded to integer
  temp.textContent = `${Math.round(apiData.main.temp)} °C`;
  description.textContent =
    apiData.weather[0].description.charAt(0).toUpperCase() + apiData.weather[0].description.slice(1); //capital first
  tempMin.textContent = `min: ${Math.round(apiData.main.temp_min)} °C`;
  tempMax.textContent = `max: ${Math.round(apiData.main.temp_max)} °C`;
  wind.textContent = `wind: ${apiData.wind.speed} m/s`;
  sunrise.textContent = `Sunrise: ${new Date(apiData.sys.sunrise * 1000).toLocaleTimeString()}`;
  sunset.textContent = `Sunset: ${new Date(apiData.sys.sunset * 1000).toLocaleTimeString()}`;
};

const displayTodayHourly = (apiData, start) => {
  //clear the old
  for (let i = 0; i < 8; i++) {
    while (todayHourlyElement[i].firstChild) {
      todayHourlyElement[i].removeChild(todayHourlyElement[i].firstChild);
    }
  }
  for (let i = 0; i < 8; i++) {
    let item1 = document.createElement('p');
    todayHourlyElement[i].appendChild(item1);
    item1.textContent = apiData.list[start].dt_txt.slice(-9, -3);

    let item2 = document.createElement('p');
    todayHourlyElement[i].appendChild(item2);
    item2.textContent = `${Math.round(apiData.list[start].main.temp)} °C`;

    let item3 = document.createElement('p');
    todayHourlyElement[i].appendChild(item3);
    item3.textContent =
      apiData.list[start].weather[0].description.charAt(0).toUpperCase() +
      apiData.list[start].weather[0].description.slice(1); //capital first

    let item4 = document.createElement('p');
    todayHourlyElement[i].appendChild(item4);
    item4.textContent = `wind: ${apiData.list[start].wind.speed} m/s`;

    start++;
  }
};

const displayNext4days = (apiData, start) => {
  for (let i = 0; i < 4; i++) {
    forecastElement[i].textContent =
      apiData.list[start].dt_txt.slice(8, 10) + '/' + apiData.list[start].dt_txt.slice(5, 7); //reverse the date

    let dateIndex = start;

    start += 8;

    forecastElement[i].addEventListener('click', () => {
      displayTodayHourly(apiData, dateIndex);
    });
  }
};

backToToday.addEventListener('click', () => {
  get5dayHourlyData(cityInput.value, countryInput.value);
});

buttonSubmit.addEventListener('click', () => {
  getTodayData(cityInput.value, countryInput.value);
  get5dayHourlyData(cityInput.value, countryInput.value);

  // Store
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('city', cityInput.value);
    localStorage.setItem('country', countryInput.value);
  }
});

getTodayData(cityInput.value, countryInput.value);
get5dayHourlyData(cityInput.value, countryInput.value);
