# 🏠 Banke Bihari Group — Real Estate Platform

> A full-stack real estate web platform for buying and selling properties, built for the Vrindavan/Mathura region of Uttar Pradesh, India.

---

## 🚀 Live Demo

| Service   | URL                          |
|-----------|------------------------------|
| Frontend  | `http://localhost:5173`      |
| Backend   | `http://localhost:8000`      |
| Admin     | `http://localhost:8000/admin`|

---

## 🧱 Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, React Router v7, Axios, Vite 7        |
| Backend    | Django 5.2, Django REST Framework 3.16          |
| Auth       | JWT (SimpleJWT) + Email Verification            |
| Database   | MySQL                                           |
| Storage    | Cloudinary (images & files)                     |
| Email      | Gmail SMTP                                      |
| Package Mgr| `uv` (Python), `npm` (Node)                     |

---

## ✨ Features

### Authentication
- Register with email + password
- Email verification (24-hour token)
- JWT login/logout with refresh token blacklist
- Password reset via email link

### Property Listings
- Multi-step sell form (5 steps: Info → Location → Features → Photos → Seller)
- Browse all listings with image cards
- Detailed property view (size, floors, parking, age, contact)
- Seller contact reveal (phone + email toggle)
- Protected sell route (login required)

### Home Page
- Video background hero section
- Auto-rotating text carousel
- Project showcase section
- Company about section
- Mobile-responsive hamburger menu

---

## 📁 Project Structure

```
Real-Estate/
├── backend/
│   ├── backend/
│   │   ├── accounts/          # Auth: register, login, verify, reset
│   │   ├── PostProperty/      # Property CRUD
│   │   └── backend/           # Django settings, URLs, WSGI
│   ├── pyproject.toml
│   └── uv.lock
└── frontend/
    ├── src/
    │   ├── Components/
    │   │   ├── Auth/           # Login + Signup
    │   │   ├── Buy/            # BuyPage + PropertyDetail
    │   │   ├── Home/           # Home, Project, AboutGroup
    │   │   └── Sell/           # Multi-step SellPage
    │   ├── utils/
    │   │   └── RequireAuth.jsx
    │   └── App.jsx
    └── package.json
```

---

## ⚙️ Setup & Run

### Prerequisites
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- Node.js 18+
- MySQL running locally

### 1. Clone the repo
```bash
git clone https://github.com/your-username/real-estate.git
cd real-estate
```

### 2. Backend Setup

Create `backend/backend/.env`:
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
EMAIL_HOST_USER=your_gmail@gmail.com
EMAIL_HOST_PASSWORD=your_gmail_app_password
```

Create MySQL database:
```sql
CREATE DATABASE realestate;
```

Run migrations and start server:
```bash
cd backend
uv run python backend/manage.py migrate
uv run python backend/manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Reference

### Auth Endpoints — `/api/accounts/`

| Method | Endpoint                                      | Description              |
|--------|-----------------------------------------------|--------------------------|
| POST   | `auth/register/`                              | Register new user        |
| GET    | `auth/verify-email/<token>/`                  | Verify email             |
| POST   | `auth/login/`                                 | Login → JWT tokens       |
| POST   | `auth/logout/`                                | Logout (blacklist token) |
| POST   | `auth/password-reset/request/`                | Request password reset   |
| GET    | `auth/password-reset/confirm/<uid>/<token>/`  | Validate reset token     |
| PATCH  | `auth/password-reset/setnewpassword/`         | Set new password         |

### Property Endpoints — `/api/property/`

| Method | Endpoint              | Description              | Auth Required |
|--------|-----------------------|--------------------------|---------------|
| GET    | `buy/`                | List all properties      | No            |
| POST   | `sell/`               | Create property listing  | Yes           |
| GET    | `property/<id>/`      | Get property detail      | No            |

---

## 🗺️ Roadmap

### ✅ Phase 1 — Core (Done)
- [x] User auth with JWT + email verification
- [x] Multi-step property listing form
- [x] Property browse + detail view
- [x] Cloudinary image uploads
- [x] Mobile-responsive navbar

### 🔄 Phase 2 — Enhancements (In Progress)
- [ ] Search & filter (city, type, price range, bedrooms)
- [ ] User dashboard (my listings, edit/delete)
- [ ] Property status (Active / Sold / Under Review)
- [ ] Pagination on listings
- [ ] Dark/Light theme toggle

### 🤖 Phase 3 — AI & ML Features
- [ ] **Price Prediction** — ML model (Random Forest / XGBoost) trained on listing data to estimate fair market value
- [ ] **AI Chatbot** — Conversational assistant for property queries, powered by a fine-tuned LLM or Gemini/OpenAI API
- [ ] **Smart Recommendations** — Suggest similar properties based on user browsing history
- [ ] **Image Quality Check** — Auto-flag blurry or low-quality property images on upload

### 📱 Phase 4 — Mobile App
- [ ] React Native app (iOS + Android)
- [ ] Push notifications for new listings
- [ ] In-app messaging between buyer and seller
- [ ] Map view with property pins

### 🚀 Phase 5 — Deployment
- [ ] Dockerize backend + frontend
- [ ] Deploy backend on Railway / Render
- [ ] Deploy frontend on Vercel / Netlify
- [ ] Switch to PostgreSQL for production
- [ ] CI/CD pipeline with GitHub Actions

---

## 🤖 AI Chatbot — Planned Architecture

```
User Message
     │
     ▼
React Chat Widget (frontend)
     │
     ▼
POST /api/chat/  (Django endpoint)
     │
     ▼
LLM API (Gemini / OpenAI)
  + Context: property listings from DB
     │
     ▼
Streamed Response → Chat UI
```

The chatbot will be able to:
- Answer questions about listed properties
- Help users narrow down their search
- Explain the buying/selling process
- Provide price estimates using the ML model

---

## 📊 ML Price Prediction — Planned Architecture

```
Training Data: PropertyListing records
     │
     ▼
Feature Engineering
  (city, locality, size_sqft, bedrooms,
   bathrooms, age, floor, parking, type)
     │
     ▼
Model: Random Forest / XGBoost
     │
     ▼
Saved as .pkl → Django API endpoint
     │
     ▼
GET /api/predict-price/?city=...&size=...
     │
     ▼
Returns: { "estimated_price": "₹45,00,000" }
```

---

## 📱 Mobile App — Planned Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Framework  | React Native (Expo)           |
| Navigation | React Navigation              |
| State      | Zustand / Redux Toolkit       |
| API        | Same Django REST backend      |
| Maps       | React Native Maps             |
| Push Notif | Expo Notifications            |

---

## 🔐 Environment Variables

| Variable           | Description                        |
|--------------------|------------------------------------|
| `SECRET_KEY`       | Django secret key                  |
| `DEBUG`            | `True` for dev, `False` for prod   |
| `CLOUD_NAME`       | Cloudinary cloud name              |
| `CLOUD_API_KEY`    | Cloudinary API key                 |
| `CLOUD_API_SECRET` | Cloudinary API secret              |
| `EMAIL_HOST_USER`  | Gmail address for sending emails   |
| `EMAIL_HOST_PASSWORD` | Gmail App Password              |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

## 👨‍💻 Built By

**Banke Bihari Group** — Real Estate, Vrindavan, Uttar Pradesh, India.

> "Our Client Satisfaction is Our Priority"
