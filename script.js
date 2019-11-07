const city = document.getElementById('city');
const description = document.getElementById('description');
const buttonSubmit = document.getElementById('submit');
const input1 = document.getElementById('input1');

const getData = async id => {
  try {
    const response = await fetch(
      'http://api.openweathermap.org/data/2.5/weather?q=' +
        id +
        ',gb&units=metric&appid=3aab69399bf03eca438758bf6e33d18e',
      {
        mode: 'cors'
      }
    );
    const fetchedData = await response.json();

    console.log(fetchedData);

    city.textContent = fetchedData.name;
    description.textContent = fetchedData.weather[0].description;
  } catch (err) {
    alert(err);
  }
};

getData('leeds');

buttonSubmit.addEventListener('click', () => {
  getData(input1.value);
});
