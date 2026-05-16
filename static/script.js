const weatherResult = document.getElementById('weatherResult');
const loading = document.getElementById('loading');
const themaToggleBtn = document.getElementById('themaToggleBtn');

function displayWeather(data) {
    weatherResult.innerHTML = `
        <div class="card shadow-lg border-0 rounded-4 mt4">
            <div class="card-body text-center">
                <h2 class="card-title" mb-3>${data.city}の天気</h2>
                            <img src="https://openweathermap.org/img/wn/${data.icon}@4x.png" alt="weather icon">
                            <p class="fs-4 text-muted">天気: ${data.description}</p>
                            <h1 class="display-3 fw-bold">気温: ${Math.round(data.temp)}°C</h1>
                            <!-- <p class="fs-4">最高気温: ${data.temp_max}°C</p> -->
                            <!-- <p class="fs-4">最低気温: ${data.temp_min}°C</p> -->
                            <div class="row mt-4">
                                <div class="col-4">
                                    <h5>湿度</h5>\
                                    <p class="fs-5">${data.humidity}%</p>
                                </div>
                                <div class="col-4">
                                    <h5>風速</h5>
                                    <p class="fs-5">${data.wind_speed}m/s</p>
                                </div>
                                <div class="col-4">
                                    <h5>日の出</h5>
                                    <p>${new Date(data.sunrise * 1000).toLocaleTimeString()}</p>
                                </div>
                                <div class="col-4">
                                    <h5>日の入</h5>
                                    <p>${new Date(data.sunset * 1000).toLocaleTimeString()}</p>
                                </div>
                            </div>
            </div>
        </div>
    `;
}

async function displayForecast(data) {
    const forecastResutl = document.getElementById('forecastResult');
    const city = document.getElementById('cityInput').value.trim() || data.city;
    try {
        const response = await fetch(`/api/forecast?city=${city}`);
        const data = await response.json();

        if (data.error) {
            forecastResult.innerHTML = `
                <p class="text-danger">${data.error}</p>
            `;
            return;
        }

        let forecastHTML = `
            <h3 class="mt-5 mb-4 text-center">週間天気</h3>
            <div class="row g-3">
        `;

        data.forEach(day => {
            const date = new Date(day.date);
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
            forecastHTML += `
                <div class="col-6 col-md-2">
                    <div class="card h-100 shadow-sm border-0 rounded-4">
                        <div class="card-body text-center">
                            <h5>${formattedDate}</h5>
                            <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png">
                            <p class="small">${day.description}</p>
                            <h4>${Math.round(day.temp)}℃</h4>
                        </div>
                    </div>
                </div>
            `;
        });

        forecastHTML += '</div>';
        forecastResult.innerHTML = forecastHTML;

    } catch (error) {
        console.error(error);
        forecastResult.innerHTML = `
            <p class="text-danger">週間天気の取得に失敗しました。</p>
        `;
    }
}

document.getElementById('weatherForm')
        .addEventListener('submit', async (e) => {
            e.preventDefault();
            const city = document.getElementById('cityInput').value.trim();
            weatherResult.innerHTML = '';
            loading.classList.remove('d-none');

            try {
                const response = await fetch(`/api/weather?city=${city}`);

                const data = await response.json();
                await new Promise(resolve => setTimeout(resolve, 1000));

                loading.classList.add('d-none');

                if (data.error) {
                    weatherResult.innerHTML = `<p class="text-danger">${data.error}</p>`;
                    return;
                }
                
                displayWeather(data);
                displayForecast(data);

            } catch (error) {
                loading.classList.add('d-none');
                weatherResult.innerHTML = `<p class="text-danger">天気情報を取得できませんでした。</p>`;
                console.error(error);

            } finally {
                loading.classList.add('d-none');
            }
        });

document.getElementById('currentLocationBtn')
    .addEventListener('click', () => {
        weatherResult.innerHTML = '';
        loading.classList.remove('d-none');
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
                const data = await response.json();
                await new Promise(resolve => setTimeout(resolve, 1000));

                if (data.error) {
                    weatherResult.innerHTML = `<p class="text-danger">${data.error}</p>`;
                    return;
                }
                displayWeather(data);
                displayForecast(data);

            } catch (error) {
                weatherResult.innerHTML = `<p class="text-danger">現在地の取得に失敗しました。</p>`;
                console.error(error);
            } finally {
                loading.classList.add('d-none');
            }
        }, (error) => {
            loading.classList.add('d-none');
            weatherResult.innerHTML = `<p class="text-danger">位置情報の取得が許可されませんでした。</p>`;
            console.error(error);
        }
    );
});

document.getElementById('clearBtn')
    .addEventListener('click', () => {
        weatherResult.innerHTML = '';
        document.getElementById('cityInput').value = '';
    });

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themaToggleBtn.innerHTML = 'ライトモード';
}

themaToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themaToggleBtn.innerHTML = 'ライトモード';
    }

    else {
        localStorage.setItem('theme', 'light');
        themaToggleBtn.innerHTML = 'ダークモード';
    }
});