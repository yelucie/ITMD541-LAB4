window.addEventListener('DOMContentLoaded', function () {
    let location = this.document.getElementById('location');
    let searchButton = this.document.getElementById('search-btn');
    let geolocation = this.document.getElementById('find-location');

    // Search functionality
    searchButton.addEventListener('click', () => {
        if (location.value.trim() !== '') {
            getCoordinates(location.value)
                .then(coordinates => {
                    // Use Promise.all to handle multiple promises
                    return Promise.all([
                        getData(coordinates.place, coordinates.lat, coordinates.lon, false),
                        getData(coordinates.place, coordinates.lat, coordinates.lon, true)
                    ]);
                })
                .then(([dataToday, dataTomorrow]) => {
                    // Handle the data for today
                    localStorage.removeItem('apiDataToday');
                    localStorage.setItem('apiDataToday', JSON.stringify(dataToday));

                    // Handle the data for tomorrow
                    localStorage.removeItem('apiDataTomorrow');
                    localStorage.setItem('apiDataTomorrow', JSON.stringify(dataTomorrow));

                    // Handle the city's name
                    localStorage.removeItem('cityName');
                    localStorage.setItem('cityName', JSON.stringify(dataToday.place));

                    window.location.href = './dashboard.html';
                })
                .catch(error => {
                    console.error("Failed to get coordinates:", error);
                    redirectToErrorPage();
                });
        }
    });

    // Geolocation functionality
    geolocation.addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                getCityName(position.coords.latitude, position.coords.longitude)
                    .then(cityName => {
                        Promise.all([
                            getData(cityName, position.coords.latitude, position.coords.longitude, false),
                            getData(cityName, position.coords.latitude, position.coords.longitude, true),
                        ])
                            .then(([dataToday, dataTomorrow]) => {
                                // Handle the data for today
                                localStorage.removeItem('apiDataToday');
                                localStorage.setItem('apiDataToday', JSON.stringify(dataToday));

                                // Handle the data for tomorrow
                                localStorage.removeItem('apiDataTomorrow');
                                localStorage.setItem('apiDataTomorrow', JSON.stringify(dataTomorrow));

                                // Handle the city's name
                                localStorage.removeItem('cityName');
                                localStorage.setItem('cityName', JSON.stringify(cityName));

                                window.location.href = './dashboard.html';
                            })
                        .catch(error => {
                            console.error("Failed to get coordinates:", error);
                            redirectToErrorPage();
                        });
                    })
            })
    });
});

function redirectToErrorPage() {
    window.location.href = './error.html';
}

function getData(place, latitude, longitude, tomorrow) {
    let sunriseUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=tomorrow`;

    if (!tomorrow) {
        sunriseUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today`;
    }

    return new Promise((resolve, reject) => {
        fetch(sunriseUrl)
            .then(res => res.json())
            .then(data => {
                results = data.results;
                const sunrise = results.sunrise;
                const dawn = results.dawn;
                const sunset = results.sunset;
                const dusk = results.dusk;
                const solarNoon = results.solar_noon;
                const dayLength = results.day_length;
                const timezone = results.timezone;
                resolve({ place, sunrise, dawn, sunset, dusk, solarNoon, dayLength, timezone });
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error);
            });
    })
}

function getCoordinates(address) {
    const coordUrl = `https://geocode.maps.co/search?q=${address}`;

    return new Promise((resolve, reject) => {
        fetch(coordUrl)
            .then(res => res.json())
            .then(data => {
                const lat = data[0].lat;
                const lon = data[0].lon;
                const place = address.charAt(0).toUpperCase() + address.slice(1).toLowerCase();
                resolve({ lat, lon, place});
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error);
            });
    });
}

function getCityName(lat, lon) {
    const coordUrl = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`;

    return new Promise((resolve, reject) => {
        fetch(coordUrl)
            .then(res => res.json())
            .then(result => {
                let city = result.address.city;
                if (city === undefined) {
                    city = result.address.country;
                }
                resolve(city);
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error);
            });
    });
}