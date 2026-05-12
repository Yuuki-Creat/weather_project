import requests
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/weather")
def get_weather():
    city = request.args.get("city")
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric&lang=ja"
    response = requests.get(url).json()
    print(f"API Response: {response}")  # デバッグ用にAPIレスポンスを出力
    
    return jsonify({
        "city": response.get("name"),
        "temp": response.get("main", {}).get("temp"),
        # "temp_min": response.get("main", {}).get("temp_min"),
        # "temp_max": response.get("main", {}).get("temp_max"),
        "humidity": response.get("main", {}).get("humidity"),
        "description": response.get("weather", [{}])[0].get("description"),
        "icon": response.get("weather", [{}])[0].get("icon"),
        "sunset": response.get("sys", {}).get("sunset"),
        "sunrise": response.get("sys", {}).get("sunrise"),
        "wind_speed": response.get("wind", {}).get("speed"),
    })

if __name__ == "__main__":
    app.run(debug=True)