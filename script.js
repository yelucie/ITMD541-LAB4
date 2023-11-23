window.addEventListener('DOMContentLoaded', function () {
    let location = this.document.getElementById('location');
    let searchButton = this.document.getElementById('search-btn');
    let geolocation = this.document.getElementById('find-location');

    // Search functionality
    searchButton.addEventListener('click', () => {
        if (location.value.trim() !== '') {
            getCoordinates(location.value)
                .then(coordinates => {
                    console.log("Latitude:", coordinates.lat);
                    console.log("Longitude:", coordinates.lon);
                })
                .catch(error => {
                    console.error("Failed to get coordinates:", error);
                    redirectToErrorPage();
                });
        }
    });


    // Geolocation functionality
    geolocation.addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position.coords.latitude + " " + position.coords.longitude);
        });
    })
});

function redirectToErrorPage() {
    console.log('buh');
    window.location.href = './error.html';
}

function getData(latitude, longitude, tomorrow) {
    let sunriseUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`;

    if (tomorrow) {
        sunriseUrl += '&date=tomorrow';
    }

    fetch(sunriseUrl)
        .then(res => res.json())
        .then(data => {
            results = data.results;
            console.log(date);
            console.log(results.sunrise);
            console.log(results.sunset);
            console.log(results.dawn);
            console.log(results.dusk);
            console.log(results.day_length);
            console.log(results.solar_noon);
            return results; // Assuming you want to use the results elsewhere
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
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
                resolve({ lat, lon });
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error);
            });
    });
}