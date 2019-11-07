const test = document.getElementById('test');
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

    test.textContent = fetchedData.name;
  } catch (err) {
    alert(err);
  }
};

getData('leeds');

buttonSubmit.addEventListener('click', () => {
  getData(input1.value);
});
