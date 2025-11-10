
# Tax Tracker Backend

The Tax Tracker Backend provides secure endpoints for managing users, income and expenses, tax computations, reminders, and financial reports.  
It supports both individual and business accounts, includes OTP verification, and provides ready endpoints for frontend integration.

---

## Table of Contents
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Base URL](#base-url)
- [Folder Structure](#folder-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributors](#contributors)
- [License](#license)

---

## Core Features

### Project Overview
The Tax Tracker App helps individuals and companies calculate, track, and manage their payable taxes based on income, business category, deductible expenses, and applicable Nigerian tax laws.  
The backend system automates tax computation, maintains financial transaction records, and generates tax reports for both Company Income Tax (CIT) and Personal Income Tax (PIT).

### MVP Goal
To build a backend that allows:
1. Users to register (individual or company)
2. Record income and deductible expenses
3. Automatically calculate estimated taxes (CIT/PIT)
4. Generate tax summary reports (PDF/CSV)
5. Send automated tax reminders

---

## Core Modules

### 1. Authentication & User Roles
**User Types:** Individual, Company  
**Endpoints:**
- `POST /auth/sign_up`
- `POST /auth/sign_in`

**Features:**
- JWT-based authentication  
- Password hashing with bcrypt  

**Fields:** `fullname`, `email`, `password`, `role`, `businessName`

---

### 2. Income & Expense Recording
Users can add, view, and delete income or expense records.

**DB Fields:**  
`user_id`, `type`, `amount`, `description`, `date`, `is_deductible`

---

### 3. Tax Computation Engine
Tax = `total_income - deductible_expenses`

**Rules:**
- CIT: 20% (< ₦100M), 30% (≥ ₦100M)
- PIT: 7%–24% progressive brackets  

---

### 4. Tax Scheduler & Reminders
Automated with node-cron:
- Monthly / quarterly reminders
- Email alerts before due dates

---

### 5. Report Generation
Users can download reports as PDF or CSV.

Example:

GET /api/report/download?format=pdf&type=summary&from=2025-01-01&to=2025-01-31

---

### 6. Security
- Input validation (express-validator)
- JWT authentication
- bcrypt password hashing
- Rate limiting
- Environment-based secrets

---

## Tech Stack

| Category | Technology |
|-----------|-------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL + Sequelize |
| Authentication | JWT + Bcrypt |
| Scheduler | Node-cron |
| Email | Nodemailer |
| Reports | PDFKit / CSV Writer |
| Env Config | Dotenv |

---

## Base URL

| Environment | URL |
|--------------|--------------------------------|
| Production | https://tax-tracker-backend.onrender.com |
| Local | http://localhost:5000 |

Example: `https://tax-tracker-backend.onrender.com/api/auth/sign_in`

---

## Folder Structure

```bash
TAX-TRACKER-BACKEND/
├── server.js
├── package.json
├── README.md
├── node_modules/
└── src/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── income.expense.controller.js
    │   ├── transaction.controller.js
    │   ├── tax.controller.js
    │   ├── otp.controller.js
    │   ├── password.controller.js
    │   ├── reminder.controller.js
    │   └── report.controller.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── transaction.routes.js
    │   ├── income.expense.routes.js
    │   ├── reminder.routes.js
    │   ├── report.routes.js
    │   └── tax.routes.js
    ├── services/
    │   ├── auth.service.js
    │   ├── email.service.js
    │   ├── transaction.service.js
    │   ├── income.expense.service.js
    │   ├── otp.service.js
    │   ├── reminder.service.js
    │   ├── report.service.js
    │   ├── sms.service.js
    │   ├── tax.service.js
    │   └── tax.summary.service.js
    ├── models/
    │   ├── index.js
    │   ├── user.model.js
    │   ├── transaction.model.js
    │   ├── income.expense.model.js
    │   ├── business.profile.js
    │   ├── reminder.model.js
    │   ├── notification.model.js
    │   └── tax.record.model.js
    ├── middlewares/
    │   ├── auth.middleware.js
    │   └── role.middleware.js
    ├── jobs/
    │   └── reminder.cron.js
    └── utils/
        ├── tax.utils.js
        ├── transaction.utils.js
        ├── validators.js
        ├── generate.token.js
        └── report.utils.js


---

Installation & Setup

1. Clone the repository

git clone https://github.com/Emmanuel00885566/Tax-tracker-backend.git
cd Tax-tracker-backend

2. Install dependencies

npm install

3. Setup environment variables

Create a .env file in the root:

DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASS=your_password
DB_HOST=localhost
DB_DIALECT=mysql
PORT=5000
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password

4. Start the development server

npm run dev

Server runs at: http://localhost:5000


---

Sample JSON

Income/Expense Example

{
  "type": "income",
  "amount": 250000,
  "description": "Freelance web project",
  "category": "Business",
  "date": "2025-10-30",
  "is_deductible": true
}

Tax Response Example

{
  "userId": "673ef02c2b94a2",
  "taxYear": 2025,
  "taxableIncome": 350000,
  "taxOwed": 52500,
  "status": "unpaid"
}


---

Common Commands

Command	Description

npm run dev	Run with Nodemon
npm start	Run production server
git pull	Fetch latest updates
git push origin <branch>	Push changes to GitHub



---

API Endpoints

Authentication

Method	Endpoint	Description	Auth

POST	/api/auth/choose_account	Select account type	No
POST	/api/auth/sign_up/individual	Register individual	No
POST	/api/auth/sign_up/business	Register business	No
POST	/api/auth/sign_in	Login	No
POST	/api/auth/send_otp	Send OTP	No
POST	/api/auth/verify_otp	Verify OTP	No
POST	/api/auth/forgot_password	Request reset link	No
PUT	/api/auth/reset_password/:token	Reset password	Yes
PATCH	/api/auth/users/change_password	Change password	Yes
GET	/api/auth/individual/profile	Get individual profile	Yes
GET	/api/auth/business/profile	Get business profile	Yes
PATCH	/api/auth/individual/profile	Update individual profile	Yes
PATCH	/api/auth/business/profile	Update business profile	Yes
DELETE	/api/auth/profile	Delete user account	Yes



---

Transactions

Method	Endpoint	Description	Auth

POST	/api/transactions/:userId	Add transaction	Yes
GET	/api/transactions/:userId	Get all transactions	Yes
GET	/api/transactions/:userId/:id	Get transaction by ID	Yes
PUT	/api/transactions/:userId/:id	Update transaction	Yes
DELETE	/api/transactions/:userId/:id	Delete transaction	Yes



---

Tax

Method	Endpoint	Description	Auth

POST	/api/tax/compute/:userId	Compute tax	Yes
GET	/api/tax/records/:userId	Fetch tax records	Yes
PATCH	/api/tax/mark-paid/:userId/:taxId	Mark as paid	Yes
GET	/api/tax/summary/:userId	Get tax summary	Yes



---

Reports

Method	Endpoint	Description	Auth

GET	/api/report/download	Download report (PDF/CSV)	Yes



---

Reminders

Method	Endpoint	Description	Auth

GET	/api/reminders/test?type=monthly	Trigger test monthly reminder	No
GET	/api/reminders/test?type=quarterly	Trigger test quarterly reminder	No
GET	/api/reminders/:userId	Get all user reminders	Yes



---

Contributors

Name	Role

Adeboye Emmanuel	Team Lead / Backend Developer
Adediji Faith	Backend Developer
Boboye Esther	Backend Developer
Adodo Daniel	Backend Developer
Echanny Idagu	Backend Developer
Mungathia Nancy Karimi	Backend Developer
Claudia Bose Olawale	Backend Developer



---

License

MIT License © 2025 Tax Tracker Team