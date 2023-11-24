window.addEventListener('DOMContentLoaded', function () {
    const storedDataToday = localStorage.getItem('apiDataToday');
    const storedDataTomorrow = localStorage.getItem('apiDataTomorrow');
    const storedCityName = JSON.parse(localStorage.getItem('cityName'));

    if (storedDataToday && storedDataTomorrow && storedCityName) {
        const dataToday = JSON.parse(storedDataToday);
        const dataTomorrow = JSON.parse(storedDataTomorrow);

        createIntroDiv(storedCityName, dataToday.timezone);
        createDashboardDiv([dataToday, dataTomorrow]);

    } else {
        // Handle the case where data is not available
        console.error('Stored data not found.');
        redirectToErrorPage();
    }
});

function redirectToErrorPage() {
    window.location.href = './error.html';
}

function createIntroDiv(cityName, timezone) {
    // Create intro div
    var introDiv = document.createElement('div');
    introDiv.className = 'intro';

    // Create h1 element for intro
    var h1 = document.createElement('h1');
    h1.textContent = 'Sunset and Sunrise Times';

    // Create p element for intro
    var p = document.createElement('p');
    p.textContent = `Here are the times for ${cityName}, in the timezone of ${timezone}.`;

    // Append h1 and p to intro div
    introDiv.appendChild(h1);
    introDiv.appendChild(p);

    // Append intro div to the body
    document.body.appendChild(introDiv);
}

function createDashboardDiv(...data) {
    // Create dashboard div
    var dashboardDiv = document.createElement('div');
    dashboardDiv.className = 'dashboard';

    // Create info div for today and tomorrow
    createInfo(dashboardDiv, true, data[0][0]);
    createInfo(dashboardDiv, false, data[0][1]);

    // Append the dashboard div to the body
    document.body.appendChild(dashboardDiv);
}

function createInfo(dashboardDiv, today, data) {
    // Create info div
    var infoDiv = document.createElement('div');
    infoDiv.className = 'info';

    // Create h2 element for date
    var h2 = document.createElement('h2');
    h2.textContent = today ? 'Today' : 'Tomorrow';

    // Create details div
    var detailsDiv = document.createElement('div');
    detailsDiv.className = 'details';

    // Create sun div
    var sunDiv = document.createElement('div');
    sunDiv.className = 'sun';

    // Create sunrise and sunset div
    createDivWithIcon(true, sunDiv, data);
    createDivWithIcon(false, sunDiv, data);

    // Append elements to their parent containers
    detailsDiv.appendChild(sunDiv);

    // Create solar noon and day length div
    createDivWithoutIcon(true, detailsDiv, data);
    createDivWithoutIcon(false, detailsDiv, data);

    infoDiv.appendChild(h2);
    infoDiv.appendChild(detailsDiv);

    dashboardDiv.appendChild(infoDiv);
}

function createDivWithIcon(sunrise, sunDiv, data) {
    // Create sunrise div
    var div = document.createElement('div');
    div.className = sunrise ? 'sunrise' : 'sunset';

    // Create sunrise icon
    var icon = document.createElement('img');
    icon.src = sunrise ? 'img/icon/sunrise.png' : 'img/icon/sunset.png';
    icon.alt = sunrise ? 'Sunrise Icon' : 'Sunset Icon';

    // Create p element for sunrise
    var p = document.createElement('p');
    p.textContent = sunrise ? `Sunrise: ${data.sunrise}` : `Sunset: ${data.sunset}`;

    // Create p element for dawn
    var extra = document.createElement('p');
    extra.textContent = sunrise ? `Dawn: ${data.dawn}` : `Dusk: ${data.dusk}`;

    // Append elements to their parent containers
    div.appendChild(icon);
    div.appendChild(p);
    div.appendChild(extra);

    sunDiv.appendChild(div);
}

function createDivWithoutIcon(solarNoon, detailsDiv, data) {
    // Create div
    var div = document.createElement('div');
    div.className = solarNoon ? 'solar-noon' : 'day-length';

    // Create p element for sunrise
    var p = document.createElement('p');
    p.textContent = solarNoon ? `The solar noon happens at ${data.solarNoon}.` : `This day's length is ${data.dayLength}.`;

    // Append element to their parent containers
    div.appendChild(p);

    detailsDiv.appendChild(div);
}