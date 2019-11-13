const apiKey = '3aab69399bf03eca438758bf6e33d18e';
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
const todayHourlyElement = document.getElementsByClassName('today-part');
const forecastDiv = document.getElementsByClassName('forecast-part');
const forecastDate = document.getElementsByClassName('forecast-part-date');
const forecastMin = document.getElementsByClassName('forecast-part-min');
const forecastMax = document.getElementsByClassName('forecast-part-max');
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
const getIndex = (apiData) => {
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
const displayToday = (apiData) => {
	city.textContent = apiData.name;
	//rounded to integer
	temp.textContent = `${Math.round(apiData.main.temp)} °C`;
	description.textContent = apiData.weather[0].description.charAt(0).toUpperCase() + apiData.weather[0].description.slice(1); //capital first
	tempMin.textContent = `min: ${Math.round(apiData.main.temp_min)} °C`;
	tempMax.textContent = `max: ${Math.round(apiData.main.temp_max)} °C`;
	wind.textContent = `wind: ${apiData.wind.speed} m/s`;
	sunrise.textContent = `Sunrise: ${new Date(apiData.sys.sunrise * 1000).toLocaleTimeString()}`;
	sunset.textContent = `Sunset: ${new Date(apiData.sys.sunset * 1000).toLocaleTimeString()}`;

	//move the form div away
	if (mainContent.style.display !== 'block') {
		form.classList.toggle('form-after');
	}
	mainContent.style.display = 'block';
	loader.style.display = 'none';
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
		item1.textContent = apiData.list[start].dt_txt.slice(-9, -3);

		let item2 = document.createElement('p');
		todayHourlyElement[i].appendChild(item2);
		item2.textContent = `${Math.round(apiData.list[start].main.temp)} °C`;
		hTemp = Math.round(apiData.list[start].main.temp);
		allTemps.push(hTemp);

		let item3 = document.createElement('p');
		todayHourlyElement[i].appendChild(item3);
		item3.textContent = apiData.list[start].weather[0].description.charAt(0).toUpperCase() + apiData.list[start].weather[0].description.slice(1); //capital first

		let item4 = document.createElement('p');
		todayHourlyElement[i].appendChild(item4);
		item4.textContent = `wind: ${apiData.list[start].wind.speed} m/s`;

		let item5 = document.createElement('img');
		todayHourlyElement[i].appendChild(item5);
		item5.src = `http://openweathermap.org/img/wn/${apiData.list[start].weather[0].icon}@2x.png`;

		start++;
	}
};

const displayNext4days = (apiData, start) => {
	for (let i = 0; i < 4; i++) {
		forecastDate[i].textContent = apiData.list[start].dt_txt.slice(8, 10) + '/' + apiData.list[start].dt_txt.slice(5, 7); //reverse the date

		let dateIndex = start;

		start += 8; //jump to the next date

		forecastMin[i].textContent = getMin(apiData, dateIndex);
		forecastMax[i].textContent = getMax(apiData, dateIndex);

		forecastDiv[i].addEventListener('click', () => {
			displayTodayHourly(apiData, dateIndex);
		});
	}
};

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
});

//Save city
saveChoice.addEventListener('click', () => {
	storageItems();
});

backToToday.addEventListener('click', () => {
	get5dayHourlyData(cityInput.value, countryInput.value);
});

closeValidPlace.addEventListener('click', () => {
	validPlace.style.display = 'none';
});
