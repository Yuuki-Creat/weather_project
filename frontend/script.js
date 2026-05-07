document.getElementById('weatherForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = document.getElementById('cityInput').value;
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    document.getElementById('weatherResult').innerHTML = `
        <h2>${data.city}の天気</h2>
        <p>気温: ${data.temp}°C</p>
        <p>天気: ${data.description}</p>
        <img src="https://openweathermap.org/img/wn/${data.icon}@2x.png" alt="天気アイコン">
    `;
});