import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")

@app.route("/api/weather")
def get_weather():
    city = request.args.get("city")
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric&lang=ja"
    response = requests.get(url).json()
    
    return jsonify({
        "city": response.get("name"),
        "temp": response.get("main", {}).get("temp"),
        "description": response.get("weather", [{}])[0].get("description"),
        "icon": response.get("weather", [{}])[0].get("icon")
    })

if __name__ == "__main__":
    app.run(debug=True)