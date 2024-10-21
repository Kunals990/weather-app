const yourWeather = document.querySelector(".yourWeather");
const yourWeatherPage = document.querySelector(".yourWeatherPage");

const searchWeatherPage = document.querySelector(".searchWeatherPage");
const searchWeather = document.querySelector(".searchWeather");

const API_KEY = "19507afa44254cfea5b70538240110";

const geolocation1 = document.querySelector(".geolocation");

const loadingGif = document.querySelector(".loadingGif")
// loadingGif.classList.add("active");

const grantAccessButton = document.querySelector(".GrantAcessbutton");
grantAccessButton.addEventListener("click",geolocation);

const inputButton = document.querySelector(".searchButton");
const inputCity = document.querySelector('#inputCity');
const searchWeatherTab = document.querySelector(".searchWeatherTab");


//render code elements
const mainText = document.querySelector(".mainText");
const temperature = document.querySelector(".tempPara");
const windSpeedVal = document.querySelector("#wind");
const humidityVal = document.querySelector("#humid");
const cloudsVal = document.querySelector("#cloud");

//reder Code elements for Search
const mainTextM = document.querySelector(".mainTextM");
const temperatureM = document.querySelector(".tempParaM");
const windSpeedValM = document.querySelector("#windM");
const humidityValM = document.querySelector("#humidM");
const cloudsValM = document.querySelector("#cloudM");

// var flagLat = 0;
var latitude ;
var longitude ;

const yourWeatherbutton = document.querySelector(".yourWeatherbutton");
const searchWeatherbutton = document.querySelector("#searchWeatherbutton");


inputButton.addEventListener("click",function(){
  weatherByCity();
})

function weatherByCity(){
  const city = inputCity.value;
  if(inputCity.value){
    getWeatherCity(city);
    // searchWeatherTab.classList.add("active");
    loadingGif.classList.remove("active");
  }
  
}

let currentTab = yourWeatherPage;

// geolocation1.classList.add("active");

function switchTab(clickedTab){
  if(clickedTab !== currentTab){
   clickedTab.classList.toggle("active");
   currentTab.classList.toggle("active");
   
   currentTab = clickedTab;
    
  }
}

yourWeatherbutton.addEventListener("click",function(){
  yourWeatherbutton.style.background = "#2998B7";
  searchWeatherbutton.style.background = "#39C3E8";
  switchTab(yourWeatherPage);
});

searchWeatherbutton.addEventListener("click",function(){
  searchWeatherbutton.style.background = "#2998B7";
  yourWeatherbutton.style.background = "#39C3E8";
switchTab(searchWeatherPage);
});



// if(flagLat==1 ){
//   loadingGif.classList.remove("active");
//   getWeatherLat(latitude,longitude);
// }


function renderCode(data){
  loadingGif.classList.add("active");
  yourWeather.classList.remove("active");
  let city = data.location.name;
  mainText.innerText = city;
  let temp = data.current.temp_c;
  temperature.innerText = `${temp}°`;
  let windspeed = data.current.wind_mph;
  let humidity = data.current.humidity;
  let clouds = data.current.cloud;
  windSpeedVal.innerText = `${windspeed}m/s`
  humidityVal.innerText = `${humidity}%`;
  cloudsVal.innerText = `${clouds}%`;
}

async function getWeatherLat(coordinates) {

  // geolocation1.classList.add("active");
  // loadingGif.classList.remove("active");
  const { latitude, longitude } = coordinates;
  let statusCode = 200; 
  let errorCode = 0;
  try {
    let response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY} &q=${latitude},${longitude}`);
    if (!response.ok) { 
      let errorMessage = await response.json();
      statusCode = response.status;
      errorCode = errorMessage.error.code;
      console.log(errorCode);
      throw new Error(`HTTP error! Status: ${response.status}`);
      }
    let data = await response.json();
    
    renderCode(data);
      
  } 
  catch (error) {
    
    if(errorCode==1006){
      console.log(`Location not found`);}

    else{
      console.log("Error found");
    }

  }
}

function renderSearchWeather(data){
  loadingGif.classList.add("active");
  searchWeather.classList.remove("active");
  let city = data.location.name;
  mainTextM.innerText = city;
  let temp = data.current.temp_c;
  temperatureM.innerText = `${temp}°`;
  let windspeed = data.current.wind_mph;
  let humidity = data.current.humidity;
  let clouds = data.current.cloud;
  console.log(data);
  windSpeedValM.innerText = `${windspeed}m/s`;
  humidityValM.innerText = `${humidity}%`;
  cloudsValM.innerText = `${clouds}%`;
}

async function getWeatherCity(city) {
  let statusCode = 200; 
  let errorCode = 0;
  try {
    // city=city1;
    let response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY} &q=${city}`);
    if (!response.ok) {
      let errorMessage = await response.json();
      statusCode = response.status;
      errorCode = errorMessage.error.code;
      console.log(errorCode);
      throw new Error(`HTTP error! Status: ${response.status}`);
      }
    let data = await response.json();
    
    
    renderSearchWeather(data);
    // console.log(`Current temperature in ${data.location.name} : ${data.current.temp_c} °C`);
      
    } 
  catch (error) {
    
    if(errorCode==1006){
      console.log(`Location not found`);}

    else{
      console.log("Error found");
    }

}

}


const locationText = document.querySelector("#weatherInfo")

function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    console.log("hi");
    geolocation1.classList.remove("active");

    // geolocation();
} else {
    const coordinates = JSON.parse(localCoordinates);
    geolocation1.classList.add("active");
    getWeatherLat(coordinates);
  }
}

getFromSessionStorage();



function geolocation() {
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // Success callback: location retrieved successfully
        const latitude1 = position.coords.latitude;
        const longitude1 = position.coords.longitude;
        console.log(`Latitude: ${latitude1.toFixed(3)}, Longitude: ${longitude1.toFixed(3)}`);
        const userCoordinates = { latitude: latitude1.toFixed(3), longitude: longitude1.toFixed(3) };
        sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
        
        // flagLat=1;
        geolocation1.classList.add("active");
        loadingGif.classList.remove("active");
        
        getWeatherLat(userCoordinates);
      },
      function (error) {
        // Error callback: handle errors like denied permission
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log("Location access not given.");
            locationText.innerText = "Location access not given.";
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            locationText.innerText = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            locationText.innerText = "The request to get user location timed out.";
            break;
          case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            locationText.innerText = "An unknown error occurred.";
            break;
        }
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
    x.innerText = "Geolocation is not supported by this browser.";
  }
   
}






