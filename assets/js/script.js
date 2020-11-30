(function() {

  var main = document.querySelector('main');
  var humberger = document.querySelector('.burger');
  var navbar = document.querySelector('.navbar');
  var bannerWrapper = document.querySelector('.banner .wrapper');
  var search = document.querySelector('.search');
  var submit = document.querySelector('.find');
  var emailForm = document.querySelector('.email-form .form-inputs');
  var email = document.querySelector('.email');
  var subscribe = document.querySelector('.subscribe');
  var mailformat = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var apiKey = "d2eb06a2c87c91643afbe3b983120c8e";


  // Function to hide and show navbar on click of humberger icon.
  humberger.addEventListener('click', function() {
    navbar.classList.toggle('hide-navbar');
  });

  // Check weather the index page main class 
  // and call that page function
  if(main.classList.contains('home-main')) indexPageJs();

  function indexPageJs() {

    // get current Month, Day and date
    function getDate() {
      var fetchDate = new Date();
      gotDate = {
        "date" : fetchDate.getDate(),
        "day" : days[fetchDate.getDay()],
        "month" : months[fetchDate.getMonth()]
      }
    }

    // On submit call validateSearchValue function to validate input value.
    submit.addEventListener('click', function (e) {
      e.preventDefault();
      validateSearchValue();
    });

    // Validate input value and call function to show error in result box
    // if value is null or not in character 
    // else call function to Fetch Weather report
    function validateSearchValue() {
      if (search.value == '') {
        showErrorMessage("Please input city name!");
      } else if (!isNaN(search.value)) {
        showErrorMessage("Please Enter Text Value!");
      }
      else {
        fetchWeatherReport();
      }
    }

    // Function to set value of apiUrl
    // On load of the homepage the results section show default result for Mumbai.
    function getApiLink() {
      if (search.value == '') {
        apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=mumbai&APPID="+apiKey;    
      } else {
        apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+search.value+"&APPID="+apiKey;    
      }
    }

    // If results not found for input value.
    // then call showErrorMessage function to show error.
    // else proceed with displaying results.
    function checkRecivedData() {
      if (gotWeatherData.cod == '404') {
          showErrorMessage(gotWeatherData.message);
      } else {
        fetchWeatherIcon();                      // call function to extract icon as per result.
        createWeatherCard();                     // call function to display Weather report.
      }
    }


    // Create element to show error message.
    // And append it to result box.
    function showErrorMessage(errorMessage) {
      clearErrorMessage();                       //  Call function to clear error message from result box.
      var errorContainer = document.createElement('div');
      errorContainer.classList.add('error-container');
      errorContainer.innerHTML = `<p class="message">${errorMessage}!</p>`;
      var reportDetails = document.querySelector('.report-details');
      reportDetails.insertBefore(errorContainer, reportDetails.childNodes[0]);
    }

    // Function to clear error message if any.
    function clearErrorMessage() {
      var errorContainer = document.querySelector('.error-container');
      if (errorContainer != undefined) {
        errorContainer.remove();
      }
    }

    // Function to fetch Weather report from API URL
    function fetchWeatherReport() {
      getApiLink();                              // call function to get API URL based on condition.
    
      fetch(apiUrl)
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        gotWeatherData = responseData;
        checkRecivedData()                       // call function to check recived data from API.
      });
    }

    // function to extract icon based on weather report.
    function fetchWeatherIcon() {
      switch (gotWeatherData.weather[0].main) {
        case "Drizzle":
          iconNumber = "icon-13";
          break;
        case "Thunderstorm":
          iconNumber = "icon-12";
          break;
        case "Rain":
          iconNumber = "icon-14";
          break;
        case "Broken clouds":
          iconNumber = "icon-3";
          break;
        case "Clouds":
          iconNumber = "icon-5";
          break;
        case "Mist":
        case "Smoke":
        case "Haze":
          iconNumber = "icon-7";
          break;
        case "Clear":        
        default:
          iconNumber = "icon-1";
      }
    }

    // Create element and Display data As per Weather report.
    function createWeatherCard() {
      var weatherCard = document.createElement('div');
        weatherCard.classList.add('weather-report');
        weatherCard.innerHTML = 
        `<div class="report-header">
          <span class="day">${gotDate.day}</span>
          <span class="date-month">${gotDate.date} ${gotDate.month}</span>
        </div>
        <div class="report-details">
          <p class="report-city">${gotWeatherData.name}</p>
          <ul class="temprature-details">
            <li class="temrature">${Math.round(gotWeatherData.main.temp - 273.15)}&degc</li>
            <li class="temparture-icon">
              <figure>
                <img src="./assets/images/icons/${iconNumber}.svg" alt="${gotWeatherData.weather[0].main}">
              </figure>
            </li>
          </ul>
          <ul class="other-weather-details">
            <li class="humidity-details">
              <figure>
                <img src="./assets/images/icon-umberella.png" alt="humidity details">
              </figure>
              <span class="humidity">${gotWeatherData.main.humidity}%</span>
            </li>
            <li class="wind-speed-details">
              <figure>
                <img src="./assets/images/icon-wind.png" alt="wind speed details">
              </figure>
              <span class="wind-speed">${Math.round(gotWeatherData.wind.speed * 3.6)}km/h</span>
            </li>
            <li class="wind-direction-details">
              <figure>
                <img src="./assets/images/icon-compass.png" alt="wind direction details">
              </figure>
              <span class="wind-direction">${gotWeatherData.wind.deg}</span>
            </li>
          </ul>
        </div>`
        bannerWrapper.appendChild(weatherCard);
        clearSearch();
        deleteExistingReport();                  // call function to delete previous result.
    }

    // After showing result clear search input field
    function clearSearch() {
      document.querySelector('.search-form').reset();
    }

    // Delete exisiting result from DOM if any
    function deleteExistingReport() {
      var existingReport = document.querySelectorAll('.weather-report');
      if (existingReport.length > 1) {
        existingReport[0].remove();
      }
    }

    getDate();                                   // call function to get current date, Month and day
    fetchWeatherReport();                        // call function to show "Mumbai" result after page load.
    
  }

  // On click of subscribe button call validateEmail function to validate input value.
  subscribe.addEventListener('click', function(e) {
    e.preventDefault();
    validateEmail();
  });

  // Function to validate email and call showResponce to show message/error
  function validateEmail() {
    if (email.value == '') {
      showResponce("Please enter email id");
    } else if(!email.value.match(mailformat)) {
      showResponce("Please enter valid email id, eg. mayurs@prdxn.com");
    } else {
      showResponce("Thanks for subscribe");
    }
  }

  // Function to show error/Message
  function showResponce(responceMessage) {
    clearMessage();
    var emailMessage = document.createElement('p');
    emailMessage.classList.add('email-response');
    emailMessage.innerText = responceMessage;
    emailForm.insertBefore(emailMessage, emailForm.firstElementChild);
  }

  // Function to clear error message if any.
  function clearMessage() {
    var isError = document.querySelector('.email-response');
    if (isError != undefined) {
      isError.remove();
    }
  }

})();