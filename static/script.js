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

                loading.classList.add('d-none');

                if (data.error) {
                    weatherResult.innerHTML = `<p class="text-danger">${data.error}</p>`;
                    return;
                }

                weatherResult.innerHTML = `<h2>${data.city}の天気</h2>
                    <img src="https://openweathermap.org/img/wn/${data.icon}@2x.png">
                    <p>天気: ${data.description}</p>
                    <p class="fs-4">最高気温: ${data.temp_max}°C</p>
                    <p class="fs-4">最低気温: ${data.temp_min}°C</p>
                    <p>湿度: ${data.humidity}%</p>
                    <p>日の出: ${new Date(data.sunrise * 1000).toLocaleTimeString()}</p>
                    <p>日の入: ${new Date(data.sunset * 1000).toLocaleTimeString()}</p>
                    `;
            } catch (error) {
                loading.classList.add('d-none');
                weatherResult.innerHTML = `<p class="text-danger">天気情報を取得できませんでした。</p>`;
                console.error(error);
            }
        });