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
const todayHourlyDiv = document.getElementById('today-hourly');
const todayHourlyElement = document.getElementsByClassName('today-part');

//today's weather
const getTodayData = async (cityName, country) => {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${country}&units=metric&appid=${apiKey}`,
      {
        mode: 'cors'
      }
    );
    const fetchedData = await response.json();

    console.log(fetchedData);

    //send the data to be displayed
    displayToday(fetchedData);
  } catch (err) {
    alert(err);
  }
};

const get5dayHourlyData = async (cityName, country) => {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?q=${cityName},${country}&units=metric&appid=${apiKey}`,
      {
        mode: 'cors'
      }
    );
    const fetchedData = await response.json();

    console.log(fetchedData);

    //get the index of the next day start 00:00:00
    let newDayIndex;
    for (let i = 0; i < fetchedData.list.length; i++) {
      if (fetchedData.list[i].dt_txt.includes('00:00:00')) {
        newDayIndex = i;
        console.log(newDayIndex);
        return;
      }
    }
  } catch (err) {
    alert(err);
  }
};

//display the data for Today
const displayToday = apiData => {
  city.textContent = apiData.name;
  description.textContent =
    apiData.weather[0].description.charAt(0).toUpperCase() + apiData.weather[0].description.slice(1); //capital first
  //rounded to integer
  temp.textContent = `${Math.round(apiData.main.temp)} °C`;
  tempMin.textContent = `min: ${Math.round(apiData.main.temp_min)} °C`;
  tempMax.textContent = `max: ${Math.round(apiData.main.temp_max)} °C`;
  wind.textContent = `wind: ${apiData.wind.speed} m/s`;
};

const displayTodayHourly = apiData => {
  for (let i = 0; i < 8; i++) {}
};

getTodayData('leeds', 'gb');
get5dayHourlyData('leeds', 'gb');

buttonSubmit.addEventListener('click', () => {
  getTodayData(cityInput.value, countryInput.value);
});
