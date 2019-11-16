const apiKey = '3aab69399bf03eca438758bf6e33d18e';
const wrapper = document.getElementById('wrapper');
const loader = document.getElementById('loader');
const mainContent = document.getElementById('content');
const buttonSubmit = document.getElementById('submit');
const saveChoice = document.getElementById('save-choice');
const form = document.getElementById('form');
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
const todayBack = document.getElementsByClassName('today-back');
const todayHourlyElement = document.getElementsByClassName('today-hourly-part');
const todayFlip = document.getElementsByClassName('today-flip');
const forecastDiv = document.getElementsByClassName('forecast-part');
const forecastDate = document.getElementsByClassName('forecast-part-date');
const forecastMin = document.getElementsByClassName('forecast-part-min');
const forecastMax = document.getElementsByClassName('forecast-part-max');
const forecastIcon = document.getElementsByClassName('forecast-part-icon');
const backToToday = document.getElementById('back-to-today');
const validPlace = document.getElementById('validPlace');
const closeValidPlace = document.getElementById('close');

//get the data from the local storage if it's not empty
if (localStorage.getItem('city') !== null && localStorage.getItem('country') !== null) {
  cityInput.value = localStorage.getItem('city');
  countryInput.value = localStorage.getItem('country');
}

//today's weather
const getTodayData = async (cityName, country) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName},${country}&units=metric&appid=${apiKey}`, {
      mode: 'cors'
    });
    const fetchedData = await response.json();
    validPlace.style.display = 'none';
    console.log(fetchedData);

    //send the data to be displayed
    displayToday(fetchedData);
  } catch (err) {
    validPlace.style.display = 'block';
  }
};

const get5dayHourlyData = async (cityName, country) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName},${country}&units=metric&appid=${apiKey}`, {
      mode: 'cors'
    });
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
  tempMin.textContent = `min: ${Math.round(apiData.main.temp_min)} °C`;
  tempMax.textContent = `max: ${Math.round(apiData.main.temp_max)} °C`;
  wind.textContent = `wind: ${apiData.wind.speed} m/s`;
  sunrise.textContent = `Sunrise: ${new Date((apiData.sys.sunrise + apiData.timezone) * 1000).toLocaleTimeString().slice(-10, -6)} AM`;
  sunset.textContent = `Sunset: ${new Date((apiData.sys.sunset + apiData.timezone) * 1000).toLocaleTimeString().slice(-10, -6)} PM`;
  description.src = `http://openweathermap.org/img/wn/${apiData.weather[0].icon}@2x.png`;

  //move the form div away
  if (mainContent.style.display !== 'block') {
    form.classList.toggle('form-after');
  }
  mainContent.style.display = 'block';
  loader.style.display = 'none';

  wrapper.style.backgroundImage = `url(images/${apiData.weather[0].main}.jpg)`;
};

const displayTodayHourly = (apiData, start) => {
  //clear the old
  for (let i = 0; i < 8; i++) {
    while (todayHourlyElement[i].firstChild) {
      todayHourlyElement[i].removeChild(todayHourlyElement[i].firstChild);
    }
  }

  let hTemp;
  let allTemps = [];

  for (let i = 0; i < 8; i++) {
    let item1 = document.createElement('p');
    todayHourlyElement[i].appendChild(item1);
    item1.textContent = `${apiData.list[start].dt_txt.slice(-9, -3)} h`;
    item1.classList.add('hourly-text');

    let item2 = document.createElement('p');
    todayHourlyElement[i].appendChild(item2);
    item2.textContent = `${Math.round(apiData.list[start].main.temp)} °C`;
    hTemp = Math.round(apiData.list[start].main.temp);
    allTemps.push(hTemp);
    item2.id = 'hourly-temp';
    item2.classList.add('hourly-text');

    let item4 = document.createElement('img');
    todayHourlyElement[i].appendChild(item4);
    item4.src = `http://openweathermap.org/img/wn/${apiData.list[start].weather[0].icon}@2x.png`;
    item4.classList.add('hourly-text');

    let item5 = document.createElement('p');
    todayHourlyElement[i].appendChild(item5);
    item5.textContent = `wind: ${apiData.list[start].wind.speed} m/s`;
    item5.classList.add('hourly-text');
    item5.id = 'hourly-wind';

    start++;
  }

  flip();
};

const displayNext4days = (apiData, start) => {
  //Clear the accumulated event listeners
  for (let i = 0; i < 5; i++) {
    var new_element = forecastDiv[i].cloneNode(true);
    forecastDiv[i].parentNode.replaceChild(new_element, forecastDiv[i]);
  }

  for (let i = 0; i < 4; i++) {
    forecastDate[i].textContent = apiData.list[start].dt_txt.slice(8, 10) + '/' + apiData.list[start].dt_txt.slice(5, 7); //reverse the date

    let dateIndex = start;

    //Each day's 12:00 for the icon
    forecastIcon[i].src = `http://openweathermap.org/img/wn/${apiData.list[start + 3].weather[0].icon}@2x.png`;

    start += 8; //jump to the next date

    forecastMin[i].textContent = `Min ${getMin(apiData, dateIndex)} °C`;
    forecastMax[i].textContent = `Max ${getMax(apiData, dateIndex)} °C`;

    //display each date hourly
    forecastDiv[i + 1].addEventListener(
      'click',
      () => {
        displayTodayHourly(apiData, dateIndex);
        clearActive();

        forecastDiv[i + 1].classList.add('active');
      },
      false
    );
  }

  //Back to today
  forecastDiv[0].addEventListener(
    'click',
    () => {
      displayTodayHourly(apiData, 0);
      clearActive();
      forecastDiv[0].classList.add('active');
    },
    false
  );
};

//clear active status
const clearActive = () => {
  for (let x = 0; x < forecastDiv.length; x++) {
    if (forecastDiv[x].classList.contains('active')) {
      forecastDiv[x].classList.remove('active');
    }
  }
};

//Flip the cards
const flip = () => {
  for (let i = 0; i < 8; i++) {
    todayBack[i].classList.toggle('rotate');
  }
};

//Get the min temp for the day between 03:00 and 00:00
getMin = (apiData, start) => {
  let hTemp;
  let allTemps = [];

  for (let i = 0; i < 8; i++) {
    hTemp = Math.round(apiData.list[start].main.temp);
    allTemps.push(hTemp);

    start++;
  }
  let min = Math.min.apply(Math, allTemps);

  return min;
};

//Get the max temp for the day between 03:00 and 00:00
getMax = (apiData, start) => {
  let hTemp;
  let allTemps = [];

  for (let i = 0; i < 8; i++) {
    hTemp = Math.round(apiData.list[start].main.temp);
    allTemps.push(hTemp);

    start++;
  }
  let max = Math.max.apply(Math, allTemps);

  return max;
};

// Storage
const storageItems = () => {
  //store if valid entry
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('city', cityInput.value);
    localStorage.setItem('country', countryInput.value);
  }
};

//SUBMIT
buttonSubmit.addEventListener('click', () => {
  getTodayData(cityInput.value, countryInput.value);
  get5dayHourlyData(cityInput.value, countryInput.value);
  loader.style.display = 'block';
  clearActive();
  //highlight today
  forecastDiv[0].classList.add('active');
});

//Save city
saveChoice.addEventListener('click', () => {
  storageItems();
});

closeValidPlace.addEventListener('click', () => {
  validPlace.style.display = 'none';
});
