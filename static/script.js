document.getElementById('weatherForm')
        .addEventListener('submit', async (e) => {
            e.preventDefault();
            const city = document.getElementById('cityInput').value;
            const weatherResult = document.getElementById('weatherResult');
            const loading = document.getElementById('loading');

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
                    `;
            } catch (error) {
                loading.classList.add('d-none');
                weatherResult.innerHTML = `<p class="text-danger">天気情報を取得できませんでした。</p>`;
                console.error(error);
            }
        });