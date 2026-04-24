from flask import Flask, render_template, jsonify
from datetime import datetime, timedelta
import random

app = Flask(__name__)

# Mock Data Generation
def generate_mock_activity():
    activities = []
    types = ["CREDENTIAL_ISSUED", "WORKER_VERIFIED", "LEDGER_UPDATE", "CONTRACT_CALL"]
    addresses = [
        "GABV...X4YZ", "GC3L...K2M4", "GD7Q...9P0R", "GA5X...6B7C", 
        "GB2W...1A2B", "GDRS...U7V8", "GCHJ...Q3W4"
    ]
    
    for i in range(15):
        activities.append({
            "address": random.choice(addresses),
            "type": random.choice(types),
            "time": f"{random.randint(1, 59)}m ago",
            "id": f"tx_{random.randint(1000, 9999)}"
        })
    return activities

def generate_chart_data():
    days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"]
    return {
        "labels": days,
        "values": [1240, 1450, 1320, 1680, 1590, 1820, 1945]
    }

@app.route('/')
def index():
    stats = {
        "active_credentials": "88",
        "total_registered": "49",
        "transactions_today": "0",
        "network_status": "100"
    }
    activity_feed = generate_mock_activity()
    chart_data = generate_chart_data()
    return render_template('index.html', stats=stats, activity_feed=activity_feed, chart_data=chart_data)

@app.route('/api/stats')
def get_stats():
    return jsonify(generate_chart_data())

if __name__ == '__main__':
    app.run(debug=True, port=5001)
