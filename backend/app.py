from flask import Flask, request, jsonify
from flask_cors import CORS
import json, os, math
from datetime import datetime

app = Flask(__name__)
from flask_cors import CORS

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

DATA_PATH = "user_1.json"

def load_data():
    if not os.path.exists(DATA_PATH):
        default = {
            "location": {"lat": 0, "lng": 0},
            "documents": {
                "id_expiry": "2025-05-01"
            },
            "visits": {
                "travel": 0,
                "renew_id": 0,
                "plates_auction": 0,
                "traffic": 0,
                "delivery": 0,
                "weapons": 0
            }
        }
        save_data(default)
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

@app.route("/update_location", methods=["POST"])
def update_location():
    data = load_data()
    body = request.json

    data["location"] = {
        "lat": body.get("lat"),
        "lng": body.get("lng")
    }

    save_data(data)

    sorted_services = smart_sort(data)
    return jsonify({"sorted_services": sorted_services})

@app.route("/log_visit", methods=["POST"])
def log_visit():
    data = load_data()
    body = request.json

    service = body.get("service")
    count = body.get("count")

    if service in data["visits"]:
        if count is not None:
            data["visits"][service] = count
        else:
            data["visits"][service] += 1

    save_data(data)
    
    sorted_services = smart_sort(data)
    return jsonify({
        "message": "logged",
        "visits": data["visits"],
        "sorted_services": sorted_services
    })

@app.route("/update_documents", methods=["POST"])
def update_documents():
    data = load_data()
    body = request.json

    if "id_expiry" in body:
        data["documents"]["id_expiry"] = body["id_expiry"]

    save_data(data)

    sorted_services = smart_sort(data)
    return jsonify({"sorted_services": sorted_services})

GEOFENCE_AREAS = [
    {"name": "King Khalid Airport", "lat": 24.9578, "lng": 46.6980, "radius_km": 7},
    {"name": "King Fahd Causeway", "lat": 26.2285, "lng": 50.6073, "radius_km": 7}
]

SERVICE_LOCATIONS = {
    "travel": {"lat": 24.9578, "lng": 46.6980},
    "renew_id": {"lat": 24.7245, "lng": 46.6881},
    "traffic": {"lat": 24.7089, "lng": 46.6753},
    "delivery": {"lat": 24.7200, "lng": 46.6800},
    "plates_auction": {"lat": 24.7300, "lng": 46.6900},
    "weapons": {"lat": 24.7150, "lng": 46.6700}
}

def distance_km(lat1, lon1, lat2, lon2):
    R = 6371
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lon2 - lon1)

    a = (math.sin(d_lat/2)**2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(d_lng/2)**2)

    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def inside_geofence(lat, lng):
    for area in GEOFENCE_AREAS:
        if distance_km(lat, lng, area["lat"], area["lng"]) <= area["radius_km"]:
            return True
    return False

def smart_sort(data):
    lat = data["location"]["lat"]
    lng = data["location"]["lng"]
    print("User location:", lat, lng)
    print("User data:", data)

    active_services = []

    # خدمة السفر - إذا قريب من مطار بنطاق 7 كيلو
    if inside_geofence(lat, lng):
        active_services.append(("travel", True))
    else:
        active_services.append(("travel", False))

    # خدمة تجديد الهوية - إذا الهوية قريبة من الانتهاء
    id_expiry_soon = False
    try:
        expiry = datetime.strptime(data["documents"]["id_expiry"], "%Y-%m-%d")
        remaining = (expiry - datetime.now()).days
        if remaining <= 90:
            id_expiry_soon = True
    except:
        pass
    active_services.append(("renew_id", id_expiry_soon))

    # خدمة مزاد اللوحات - إذا دخل واجد مرات
    plates_many_visits = data["visits"].get("plates_auction", 0) >= 10
    active_services.append(("plates_auction", plates_many_visits))

    # خدمة السلاح - إذا عنده سلاح
    has_weapons = data["visits"].get("weapons", 0) > 0
    active_services.append(("weapons", has_weapons))

    # الخدمات الأخرى
    active_services.append(("traffic", False))
    active_services.append(("delivery", False))

    # ترتيب: الخدمات النشطة (True) فوق، ثم الباقي
    sorted_services = sorted(active_services, key=lambda x: x[1], reverse=True)
    
    print("Sorted services:", sorted_services)

    return sorted_services

@app.route("/get_data", methods=["GET"])
def get_data():
    data = load_data()
    sorted_services = smart_sort(data)
    return jsonify({
        "location": data["location"],
        "documents": data["documents"],
        "visits": data["visits"],
        "sorted_services": sorted_services
    })

@app.route("/sorted_services", methods=["GET"])
def get_sorted():
    data = load_data()
    return jsonify({"sorted_services": smart_sort(data)})

if __name__ == "__main__":
    app.run(debug=True)