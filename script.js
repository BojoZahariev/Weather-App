const test = document.getElementById('img');
const buttonNewGif = document.getElementById('newGif');
const buttonSubmit = document.getElementById('submit');
const input1 = document.getElementById('input1');

async function giffys() {
  const response = await fetch(
    'http://api.openweathermap.org/data/2.5/weather?id=2172797&appid=3aab69399bf03eca438758bf6e33d18e',
    {
      mode: 'cors'
    }
  );
  const gifData = await response.json();

  console.log(gifData);
  //test.textContent = gifData.data.coord;

  response.catch(err => alert(err));
}

giffys();

/*
buttonNewGif.addEventListener('click', () => {
  if (input1.value) {
    giffys(input1.value);
  } else {
    giffys('dog');
  }
});
*/
buttonSubmit.addEventListener('click', () => {
  giffys(input1.value);
});

