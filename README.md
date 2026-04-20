<div align="center">

# 🏠 Banke Bihari Group — Real Estate Platform

**Full-stack real estate platform for buying & selling properties in Vrindavan/Mathura, India.**  
Built with Django REST Framework, React 19, JWT authentication, and Cloudinary storage.  
Phase 3 roadmap includes ML price prediction and an AI property chatbot.

[![Django](https://img.shields.io/badge/Django-5.2-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Storage-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📸 Preview

| Home Page | Property Listings | Property Detail |
|-----------|------------------|-----------------|
| Video hero + carousel | Card grid with images | Full detail + seller contact |

---

## ✨ Features

### 🔐 Authentication
- Register with email + password
- Email verification (24-hour token)
- JWT login/logout with refresh token blacklist
- Password reset via email link

### 🏡 Property Listings
- Multi-step sell form (5 steps: Info → Location → Features → Photos → Seller)
- Browse all listings with image cards
- Detailed property view (size, floors, parking, age, contact)
- Seller contact reveal (phone + email toggle)
- Protected sell route (login required)

### 🌐 Home Page
- Video background hero section
- Auto-rotating text carousel
- Project showcase section
- Company about section
- Mobile-responsive hamburger menu

---

## 🧱 Tech Stack

| Layer       | Technology                                       |
|-------------|--------------------------------------------------|
| Frontend    | React 19, React Router v7, Axios, Vite 7         |
| Backend     | Django 5.2, Django REST Framework 3.16           |
| Auth        | JWT (SimpleJWT) + Email Verification             |
| Database    | MySQL (SQLite for dev)                           |
| Storage     | Cloudinary (images & files)                      |
| Email       | Gmail SMTP                                       |
| Package Mgr | `uv` (Python), `npm` (Node)                      |

---

## 📁 Project Structure

```
Real-Estate/
├── .github/
│   ├── ISSUE_TEMPLATE/        # Bug & feature request templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CONTRIBUTING.md
│   └── SECURITY.md
├── Backend/
│   └── backend/
│       ├── accounts/          # Auth: register, login, verify, reset
│       ├── PostProperty/      # Property CRUD
│       └── backend/           # Django settings, URLs, WSGI
├── frontend/
│   └── src/
│       ├── Components/
│       │   ├── Auth/          # Login + Signup
│       │   ├── Buy/           # BuyPage + PropertyDetail
│       │   ├── Home/          # Home, Project, AboutGroup
│       │   └── Sell/          # Multi-step SellPage
│       ├── utils/
│       │   └── RequireAuth.jsx
│       └── App.jsx
└── README.md
```

---

## ⚙️ Setup & Run

### Prerequisites
- [uv](https://docs.astral.sh/uv/) — Python package manager
- Node.js 18+
- MySQL (or SQLite for quick local dev)

### 1. Clone the repo
```bash
git clone https://github.com/Mradulmanimishra/Real-Estate.git
cd Real-Estate
```

### 2. Backend Setup

Create `Backend/backend/.env`:
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

Install dependencies and run:
```bash
cd Backend
uv sync
uv run python backend/manage.py migrate
uv run python backend/manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 🚀 Running URLs

| Service   | URL                           |
|-----------|-------------------------------|
| Frontend  | http://localhost:5173          |
| Backend   | http://localhost:8000          |
| Admin     | http://localhost:8000/admin    |

---

## 🔌 API Reference

### Auth — `/api/accounts/`

| Method | Endpoint                                      | Description              |
|--------|-----------------------------------------------|--------------------------|
| POST   | `auth/register/`                              | Register new user        |
| GET    | `auth/verify-email/<token>/`                  | Verify email             |
| POST   | `auth/login/`                                 | Login → JWT tokens       |
| POST   | `auth/logout/`                                | Logout (blacklist token) |
| POST   | `auth/password-reset/request/`                | Request password reset   |
| GET    | `auth/password-reset/confirm/<uid>/<token>/`  | Validate reset token     |
| PATCH  | `auth/password-reset/setnewpassword/`         | Set new password         |

### Property — `/api/property/`

| Method | Endpoint           | Description             | Auth     |
|--------|--------------------|-------------------------|----------|
| GET    | `buy/`             | List all properties     | No       |
| POST   | `sell/`            | Create property listing | Required |
| GET    | `property/<id>/`   | Get property detail     | No       |

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
- [ ] **Price Prediction** — Random Forest / XGBoost model trained on listing data
- [ ] **AI Chatbot** — Conversational assistant powered by Gemini / OpenAI API
- [ ] **Smart Recommendations** — Suggest similar properties based on browsing history
- [ ] **Image Quality Check** — Auto-flag blurry or low-quality property photos

### 📱 Phase 4 — Mobile App
- [ ] React Native app (iOS + Android) with Expo
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

## 🔐 Environment Variables

| Variable              | Description                        |
|-----------------------|------------------------------------|
| `SECRET_KEY`          | Django secret key                  |
| `DEBUG`               | `True` for dev, `False` for prod   |
| `CLOUD_NAME`          | Cloudinary cloud name              |
| `CLOUD_API_KEY`       | Cloudinary API key                 |
| `CLOUD_API_SECRET`    | Cloudinary API secret              |
| `EMAIL_HOST_USER`     | Gmail address for sending emails   |
| `EMAIL_HOST_PASSWORD` | Gmail App Password                 |

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) first.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 🔒 Security

Found a vulnerability? See [SECURITY.md](.github/SECURITY.md) for responsible disclosure.

---

## 📄 License

[MIT License](LICENSE) — free to use, modify, and distribute.

---

<div align="center">

**Built by [Mradul Mani Mishra](https://github.com/Mradulmanimishra)**  
Banke Bihari Group — Real Estate, Vrindavan, Uttar Pradesh, India

*"Our Client Satisfaction is Our Priority"*

⭐ Star this repo if you find it useful!

</div>
