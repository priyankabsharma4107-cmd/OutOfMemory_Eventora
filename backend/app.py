
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask import make_response
from flask import Response
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error

load_dotenv()

app = Flask(__name__)
CORS(app)


def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        connection_timeout=15
    )


def setup_database():
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            category VARCHAR(100) NOT NULL,
            event_date DATE NOT NULL,
            location VARCHAR(200) NOT NULL,
            description TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS registrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            event_id INT NOT NULL,
            participant_name VARCHAR(100) NOT NULL,
            participant_email VARCHAR(255) NOT NULL,
            registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES events(id)
        )
    """)

    cursor.execute("SELECT COUNT(*) FROM events")
    if cursor.fetchone()[0] == 0:
        samples = [
            ("AI & Machine Learning Workshop", "Technology",
             "2026-11-15", "Navi Mumbai",
             "Explore AI concepts and practical applications."),
            ("Web Development Bootcamp", "Technology",
             "2026-11-20", "Navi Mumbai",
             "Learn modern web development."),
            ("Campus Innovation Hackathon", "Hackathon",
             "2026-11-25", "Panvel",
             "Build creative solutions to real-world problems.")
        ]

        cursor.executemany("""
            INSERT INTO events
            (title, category, event_date, location, description)
            VALUES (%s, %s, %s, %s, %s)
        """, samples)

    db.commit()
    cursor.close()
    db.close()


@app.route("/")
def home():
    return jsonify({
        "message": "Welcome to EVENTORA API",
        "status": "running"
    })


@app.route("/api/health")
def health():
    try:
        db = get_db()
        db.close()
        return jsonify({
            "status": "connected",
            "database": "Railway MySQL"
        })
    except Error as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/events", methods=["GET"])
def get_events():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, title, category, event_date AS date,
                   location, description
            FROM events ORDER BY event_date
        """)
        rows = cursor.fetchall()

        for event in rows:
            event["date"] = event["date"].isoformat()

        cursor.close()
        db.close()
        return jsonify(rows)
    except Error as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, title, category, event_date AS date,
                   location, description
            FROM events WHERE id = %s
        """, (event_id,))
        event = cursor.fetchone()
        cursor.close()
        db.close()

        if event is None:
            return jsonify({"error": "Event not found"}), 404

        event["date"] = event["date"].isoformat()
        return jsonify(event)
    except Error as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/events", methods=["POST"])
def add_event():
    data = request.get_json(silent=True) or {}

    required = ["title", "category", "date", "location"]
    if any(not data.get(field) for field in required):
        return jsonify({
            "error": "Title, category, date and location are required"
        }), 400

    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO events
            (title, category, event_date, location, description)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            data["title"], data["category"], data["date"],
            data["location"], data.get("description", "")
        ))
        new_id = cursor.lastrowid
        db.commit()
        cursor.close()
        db.close()

        return jsonify({
            "message": "Event added successfully",
            "id": new_id
        }), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/registrations", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    event_id = data.get("event_id")
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()

    if not event_id or not name or not email:
        return jsonify({
            "error": "event_id, name and email are required"
        }), 400

    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "SELECT id FROM events WHERE id = %s", (event_id,)
        )
        if cursor.fetchone() is None:
            cursor.close()
            db.close()
            return jsonify({"error": "Event not found"}), 404

        cursor.execute("""
            INSERT INTO registrations
            (event_id, participant_name, participant_email)
            VALUES (%s, %s, %s)
        """, (event_id, name, email))

        registration_id = cursor.lastrowid
        db.commit()
        cursor.close()
        db.close()

        return jsonify({
            "message": "Registration saved successfully",
            "registration_id": registration_id
        }), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500


try:
    setup_database()
    print("EVENTORA connected to Railway MySQL!")
except Error as e:
    print("Database connection failed:", e)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
