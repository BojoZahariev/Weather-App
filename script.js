const buttonSubmit = document.getElementById('submit');
const input1 = document.getElementById('input1');
const city = document.getElementById('city');
const description = document.getElementById('description');
const temp = document.getElementById('temp');

const getData = async cityName => {
  try {
    const response = await fetch(
      'http://api.openweathermap.org/data/2.5/weather?q=' +
        cityName +
        ',gb&units=metric&appid=3aab69399bf03eca438758bf6e33d18e',
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

//display the data
const display = apiData => {
  city.textContent = apiData.name;
  description.textContent = apiData.weather[0].description;
  //round to one float
  temp.textContent = `${Math.round(apiData.main.temp * 10) / 10} °C`;
};

getData('leeds');

buttonSubmit.addEventListener('click', () => {
  getData(input1.value);
});
