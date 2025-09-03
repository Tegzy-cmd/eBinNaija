```markdown
# ♻️ eWaste Collection & Recycling Platform – Backend

A scalable **Node.js + TypeScript + Express + MongoDB + Redis** backend powering an **eWaste collection and recycling platform**.  
It connects **citizens (waste generators)**, **collectors (pickup agents)**, and **recyclers**, with features for **AI waste analysis, cloud-based image storage, and rewards management**.

---

## ✨ Features

- 🔑 **Authentication & Authorization**
  - JWT-based login & register
  - Email verification via OTP
  - Password reset with secure token
  - Redis-based token blacklisting (logout support)

- 🚚 **Pickup & Collection System**
  - Citizens can request pickups
  - Collectors accept and manage jobs
  - Real-time status tracking

- 🖼️ **Image Uploads**
  - Cloudinary integration for waste images

- 📦 **Caching & Background Jobs**
  - Redis + BullMQ for async jobs
  - Email/SMS notifications
  - AI waste classification (future-ready)

- 🏗️ **Scalability**
  - PM2 cluster mode for load balancing
  - Redis caching for performance

---

## 🛠️ Tech Stack

- **Backend Framework:** Node.js + Express (TypeScript)
- **Database:** MongoDB (Mongoose ORM)
- **Caching & Queues:** Redis + BullMQ
- **Image Storage:** Cloudinary
- **Auth:** JWT, bcrypt
- **Deployment:** PM2 (cluster mode), Docker-ready
- **Testing:** Jest + Supertest

---

## 📂 Project Structure

```

ewaste-backend/
│── src/
│   ├── config/            # DB, Redis, Cloudinary, env
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth, validation, error handling
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic (AI, payments, caching)
│   ├── utils/             # Helpers (logger, email, SMS)
│   ├── jobs/              # Redis/BullMQ background jobs
│   └── app.ts             # Express app
│
├── ecosystem.config.js    # PM2 config
├── tsconfig.json
├── package.json
├── .env
└── README.md

````

---

## 🚀 Getting Started

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-org/ewaste-backend.git
cd ewaste-backend
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ewaste
JWT_SECRET=supersecret

REDIS_URL=redis://127.0.0.1:6379

CLOUD_NAME=your_cloud_name
CLOUD_KEY=your_cloudinary_key
CLOUD_SECRET=your_cloudinary_secret

EMAIL_USER=your@email.com
EMAIL_PASS=yourpassword

FRONTEND_URL=http://localhost:3000
```

### 4️⃣ Run in Development

```bash
npm run dev
```

### 5️⃣ Build & Run in Production

```bash
npm run build
pm2 start ecosystem.config.js
```

---

## 📡 API Documentation

The API is documented using **OpenAPI/Swagger**.

* Import [`ewaste-openapi.yaml`](./ewaste-openapi.yaml) into [Swagger Editor](https://editor.swagger.io) or Postman.
* Optional: Serve docs at `/docs` using Swagger UI.

---

## 🧪 Running Tests

```bash
npm run test
```

---

## 📌 Roadmap

* [x] Authentication (Register, Login, Logout, Profile)
* [x] Email Verification & Password Reset
* [ ] Pickup & Job Management
* [ ] AI Waste Classification Service
* [ ] Wallet & Rewards Integration
* [ ] Admin Dashboard APIs

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m "Add amazing feature"`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

---

## 📜 License

MIT License © 2025 \[Your Name / Organization]

