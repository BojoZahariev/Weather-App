const buttonSubmit = document.getElementById('submit');
const cityInput = document.getElementById('input1');
const countryInput = document.getElementById('input2');
const city = document.getElementById('city');
const description = document.getElementById('description');
const temp = document.getElementById('temp');
const tempMin = document.getElementById('temp-min');
const tempMax = document.getElementById('temp-max');

const getData = async (cityName, country) => {
  try {
    const response = await fetch(
      'http://api.openweathermap.org/data/2.5/weather?q=' +
        cityName +
        ',' +
        country +
        '&units=metric&appid=3aab69399bf03eca438758bf6e33d18e',
      {
        mode: 'cors'
      }
    );
    const fetchedData = await response.json();

    console.log(fetchedData);

    //send the data to be displayed
    display(fetchedData);
  } catch (err) {
    alert(err);
  }
};

const get5dayData = async (cityName, country) => {
  try {
    const response = await fetch(
      'http://api.openweathermap.org/data/2.5/forecast?q=' +
        cityName +
        ',' +
        country +
        '&mode=json&units=metric&appid=3aab69399bf03eca438758bf6e33d18e',
      {
        mode: 'cors'
      }
    );
    const fetchedData = await response.json();

    console.log(fetchedData);
  } catch (err) {
    alert(err);
  }
};

//display the data
const display = apiData => {
  city.textContent = apiData.name;
  description.textContent =
    apiData.weather[0].description.charAt(0).toUpperCase() + apiData.weather[0].description.slice(1); //capital first
  //rounded to integer
  temp.textContent = `${Math.round(apiData.main.temp)} °C`;
  tempMin.textContent = `min: ${Math.round(apiData.main.temp_min)} °C`;
  tempMax.textContent = `max: ${Math.round(apiData.main.temp_max)} °C`;
};

getData('leeds', 'gb');
get5dayData('leeds', 'gb');

buttonSubmit.addEventListener('click', () => {
  getData(cityInput.value, countryInput.value);
});
