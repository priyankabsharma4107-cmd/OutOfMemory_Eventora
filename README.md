# 🎟️ EVENTORA — Event Discovery & Community Engagement Platform

### ✨ Find your next something.

EVENTORA is an event discovery platform designed to help people explore events, discover new interests, and connect with activities across different categories. It provides an accessible interface for browsing events and viewing important details such as dates, timings, locations, and descriptions.

🌐 **Live Website:** https://wonderful-genie-ad3590.netlify.app

🔗 **GitHub Repository:** https://github.com/priyankabsharma4107-cmd/OutOfMemory_Eventora

🚀 **Backend API:** https://outofmemoryeventora-production-9ca1.up.railway.app/api/events

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Project Vision](#-project-vision)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [Technology Stack](#️-technology-stack)
- [System Architecture](#️-system-architecture)
- [Database Overview](#️-database-overview)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Installation and Setup](#-installation-and-setup)
- [Project Objectives](#-project-objectives)
- [Future Improvements](#-future-improvements)
- [Developer](#‍-developer)
- [Acknowledgements](#-acknowledgements)
- [Support](#-support)

---

## 🌟 About the Project

Finding relevant events can be challenging when information is scattered across different platforms. EVENTORA aims to simplify this process by bringing event information together in one place.

The platform helps users browse events, explore supported categories, search for activities, and view essential event details. It combines a frontend interface with a Flask backend and a MySQL database to provide an organized event discovery experience.

## 🎯 Project Vision

To make event discovery simpler, more accessible, and more engaging by connecting people with experiences, communities, and opportunities that match their interests.

## 🚀 Key Features

- 🔍 **Event Discovery:** Browse available events through an organized interface.
- 🧭 **Search and Categories:** Find events using relevant keywords and supported categories.
- 📅 **Event Details:** Explore event dates, locations, descriptions, and other available information.
- 🔗 **REST API:** Retrieve and manage event data through Flask API endpoints.
- 🗄️ **MySQL Integration:** Store event and event-registration information in a relational database.
- ☁️ **Cloud Deployment:** Frontend hosted on Netlify and backend hosted on Railway.
- 📱 **Web Interface:** Access the platform through a web browser.

## 🔄 How It Works

1. **Visit:** Open the EVENTORA website.
2. **Explore:** Browse the available events.
3. **Search:** Look for events using relevant keywords or categories.
4. **View:** Check event details such as dates, locations, and descriptions.
5. **Retrieve Data:** The frontend communicates with the Flask backend through API requests.
6. **Store Data:** The backend interacts with MySQL to retrieve and store supported information.

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Python, Flask |
| API | REST API, Flask-CORS |
| Database | MySQL |
| Frontend Hosting | Netlify |
| Backend Hosting | Railway |
| Version Control | Git, GitHub |

## 🏗️ System Architecture

EVENTORA follows a frontend-backend-database architecture.

```text
             ┌──────────────────────┐
             │         User         │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │   Frontend Website   │
             │    HTML, CSS, JS     │
             │       Netlify        │
             └──────────┬───────────┘
                        │ HTTP Requests
                        ▼
             ┌──────────────────────┐
             │    Flask Backend     │
             │       Railway        │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │    MySQL Database    │
             │       Railway        │
             └──────────────────────┘
```

## 🗄️ Database Overview

EVENTORA uses MySQL with two tables, created automatically when the backend starts.

### 1. `events`

Stores information about available events.

| Column | Type |
|---|---|
| `id` | INT (Primary Key, Auto Increment) |
| `title` | VARCHAR(200) |
| `category` | VARCHAR(100) |
| `event_date` | DATE |
| `location` | VARCHAR(200) |
| `description` | TEXT |

### 2. `registrations`

Stores participant information associated with event registrations.

| Column | Type |
|---|---|
| `id` | INT (Primary Key, Auto Increment) |
| `event_id` | INT (Foreign Key → `events.id`) |
| `participant_name` | VARCHAR(100) |
| `participant_email` | VARCHAR(255) |
| `registered_at` | TIMESTAMP |

**Relationship:** The `event_id` column connects a registration to its corresponding event through `events.id`.

## 🔌 API Documentation

**Base URL**

```text
https://outofmemoryeventora-production-9ca1.up.railway.app
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend health |
| GET | `/api/events` | Retrieve available events |
| GET | `/api/events/<id>` | Retrieve a specific event |
| POST | `/api/events` | Submit event data |
| POST | `/api/registrations` | Submit an event registration |

### Example: Retrieve Events

```http
GET /api/events
```

Using JavaScript:

```javascript
fetch("https://outofmemoryeventora-production-9ca1.up.railway.app/api/events")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error fetching events:", error));
```

*Note: The `/api/registrations` endpoint is for event registrations, not user-account registration.*

## 📂 Project Structure

```text
OutOfMemory_Eventora/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
└── README.md
```

*The structure shown above is illustrative. Adjust filenames and folders to match the actual repository.*

## 💻 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/priyankabsharma4107-cmd/OutOfMemory_Eventora.git
```

### 2. Navigate to the Project

```bash
cd OutOfMemory_Eventora
```

### 3. Set Up the Backend

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` folder:

```text
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

Replace the placeholder values with your actual MySQL database credentials.

**Important:** Never commit the `.env` file to GitHub. Add it to `.gitignore` to protect database credentials.

### 5. Run the Backend

```bash
python app.py
```

### 6. Open the Frontend

Open `frontend/index.html` in your browser or run it using a local development server.

For local development, ensure the frontend's API URL points to the backend address being used.

## 🎯 Project Objectives

- Simplify event discovery and browsing.
- Organize event information in one platform.
- Provide a user-friendly event discovery interface.
- Demonstrate frontend and backend integration.
- Apply REST API concepts in a practical project.
- Integrate MySQL for persistent data storage.
- Gain hands-on experience with cloud deployment.

## 🔮 Future Improvements

- Personalized event recommendations.
- Improved event filtering and sorting.
- Enhanced mobile responsiveness and accessibility.
- Additional event categories and discovery options.
- Improved event management and analytics capabilities.

---

> **Note:** The backend runs on Railway's trial/free tier, so the API may be offline at times.

---

## 👩‍💻 Developer

**Priyanka Sharma**

Bachelor of Computer Applications with Artificial Intelligence

Pillai University, School of Computing

---

## 🙌 Acknowledgements

This project provided an opportunity to apply web development concepts, explore backend API development, integrate a relational database, and learn about deploying a full-stack application.

Thanks to everyone who provided guidance, support, and encouragement throughout the development journey.

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub!

🔗 **Repository:** https://github.com/priyankabsharma4107-cmd/OutOfMemory_Eventora

---

<p align="center">
  <strong>🎟️ EVENTORA — Find your next something.</strong>
  <br>
  Built with curiosity, creativity, and code. 💜
</p>
