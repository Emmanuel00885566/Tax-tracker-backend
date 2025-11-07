# Tax Tracker Backend

The **Tax Tracker Backend** provides secure endpoints for managing users, income and expenses, tax computations, reminders, and financial reports.  
It supports both **individual** and **business** accounts, includes OTP verification, and provides ready endpoints for frontend integration.


## Table of Contents
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Base URL](#base-url)
- [Folder Structure](#folder-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [Contributors](#contributors)
- [License](#license)

## Core Features


---

## Tech Stack
| Category | Technology |
|-----------|-------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | **PostgreSQL / Sequelize** |
| Authentication | JWT + Bcrypt |
| Scheduler | Node-cron |
| Email | Nodemailer |
| Reports | pdfkit  |
| Environment | Dotenv |

---

## Base URL

| Environment | URL |
|--------------|---------------------------------------------|
| **Production (Live)** | https://tax-tracker-backend.onrender.com/ |
| **Local Development** | http://localhost:5000 |

> Tip: Append any route to the base URL to test directly.  
> Example:  
> `https://tax-tracker-backend.onrender.com/api/auth/sign_in`

##  Folder Structure
.
├─ server.js  
├─ package.json  
├─ .env.example  
├─ src/  
│  ├─ config/  
│  │  └─ db.js  
│  ├─ controllers/  
│  │  ├─ auth.controller.js  
│  │  ├─ transaction.controller.js  
│  │  └─ tax.controller.js  
│  ├─ middlewares/  
│  │  └─ auth.middleware.js  
│  ├─ models/  
│  │  ├─ index.js  
│  │  ├─ user.model.js  
│  │  ├─ transaction.model.js  
│  │  └─ taxRecord.model.js  
│  ├─ routes/  
│  │  ├─ auth.routes.js  
│  │  ├─ transactions.routes.js  
│  │  └─ tax.routes.js  
│  ├─ services/  
│  │  ├─ auth.service.js  
│  │  ├─ transaction.service.js  
│  │  └─ tax.service.js  
│  └─ utils/  
│     └─ tax.utils.js  
└─ README.md  

##  Installation & Setup

###  Clone the repository
```bash
git clone https://github.com/Emmanuel00885566/Tax-tracker-backend.git
cd Tax-tracker-backend

Install dependencies

npm install

 Create a .env file
PORT=5000

 Run the development server
npm run dev
Server runs on  http://localhost:5000


 Sample JSON (Income or Expense)
{
  "type": "income",
  "amount": 250000,
  "description": "Freelance web project",
  "category": "Business",
  "date": "2025-10-30",
  "is_deductible": true
}


Example Tax Response
{
  "userId": "673ef02c2b94a2",
  "taxYear": 2025,
  "taxableIncome": 350000,
  "taxOwed": 52500,
  "status": "unpaid"
}

Common Commands

Command	Description
npm run dev	Run with Nodemon
npm start	Run production server
git pull	Fetch latest updates
git push origin 	Push changes to GitHub
```

## Environment Variables

Create a `.env` file in the project root and add:

DB_NAME=database_name  
DB_USER=user  
DB_PASS=database_password  
DB_HOST=localhost  
DB_DIALECT=mysql  
PORT=5000  
JWT_SECRET=your_secret_key_here  
CLIENT_URL=http://localhost:5173  
EMAIL_USER=your_email@gmail.com  
EMAIL_PASS=your_app_password  

## API Endpoints

### Authentication & User Management 
| Method | Endpoint | Description | Auth
|--------|------------------------------------|---------------------------------------- | -----
| POST | /api/auth/choose_account | Placeholder for account type selection | No
| POST | /api/auth/sign_up/individual | Register individual user | No
| POST | /api/auth/sign_up/business | Register business user  | No
| POST | /api/auth/sign_in | Login | No
| POST | /api/auth/send_otp | Send OTP for verification | No
| POST | /api/auth/verify_otp | Verify OTP | No
| POST | /api/auth/forgot_password  | Request password reset | No
| PUT | /api/auth/reset_password/:token | Reset password with token | Yes
| PATCH | /api/auth/users/change_password |  Change password | Yes
| GET | /api/auth/individual/profile | Fetch individual profile  | Yes
| GET | /api/auth/business/profile | Fetch business profile  | Yes
| PATCH | /api/auth/individual/profile | Update individual profile | Yes
| PATCH | /api/auth/business/profile | Update business profile | Yes
| PUT | /api/auth/preferences/reminders | Update reminder preferences | Yes
| DELETE | /api/auth/profile  | Delete user account  | Yes

---

### Income & Expense Management 

| Method | Endpoint | Description | Auth
|--------|-----------------------------------|---------------------------------------- | -----
| POST | /api/income-expense/:userId  | Create new income or expense record | Yes
| GET | /api/income-expense/:userId  | Get all income/expense records for user | Yes
| GET | /api/income-expense/:userId/:id | Get a single income/expense record by ID | Yes
| PUT | /api/income-expense/:userId/:id  | Update a specific record | Yes
| DELETE | /api/income-expense/:userId/:id | Delete a specific record | Yes
| GET | /api/income-expense/:userId/summary | Get income/expense summary for user | Yes

---

### Transaction Management (Ledger)

| Method | Endpoint | Description | Auth
|--------|-----------------------------------|----------------------------------- | -----
| POST | /api/transactions/:userId  | Add a transaction | Yes
| GET | /api/transactions/:userId | Get all transactions | Yes
| GET | /api/transactions/:userId/:id | Get a transaction by ID | Yes
| PUT |/api/transactions/:userId/:id | Update a transaction | Yes
| DELETE | /api/transactions/:userId/:id | Delete a transaction | Yes


---

### Tax Computation 

| Method | Endpoint | Description | Auth
|--------|-------------------------------------|-------------------------------------- | -----
| POST | /api/tax/compute/:userId  | Compute tax (CIT/PIT) for user | Yes
| GET | /api/tax/records/:userId | Fetch all tax records for user | Yes
| PATCH | /api/tax/mark-paid/:userId/:taxId | Mark a tax record as paid | Yes
| GET | /api/tax/summary/:userId | Fetch tax summary for user | Yes

---

### Reports

| Method | Endpoint | Description | Auth
|--------|--------------------|--------------------------------------- | -----
| GET | /api/report/download | Download tax summary report (PDF/CSV) | Yes

---

### Reminders

| Method | Endpoint | Description | Auth
|--------|----------------------------------|-------------------------------------------- | -----
| GET | /api/reminders/test?type=monthly | Trigger test monthly reminder manually | No
| GET | /api/reminders/test?type=quarterly | Trigger test quarterly reminder manually | No
| GET | /api/reminders/:userId | Fetch all reminders for a user | Yes

---

## How It Works 
(Not Yet Done)

##  Contributors

| Name                   | Role                          |
| ---------------------- | ----------------------------- |
| Adeboye Emmanuel       | Team Lead / Backend Developer |
| Adediji Faith          | Backend Developer             |
| Boboye Esther          | Backend Developer             |
| Adodo Daniel           | Backend Developer             |
| Echanny Idagu          | Backend Developer             |
| KaryM                  | Backend Developer             |
| Claudia Bose Olawale   | Backend Developer             |

Author



 License
