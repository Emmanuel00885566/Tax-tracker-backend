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

### **Project Overview**
The **Tax Tracker App** helps individuals and companies calculate, track, and manage their payable taxes based on income, business category, deductible expenses, and applicable Nigerian tax laws.  
The backend system automates tax computation, maintains financial transaction records, and generates tax reports for both **Company Income Tax (CIT)** and **Personal Income Tax (PIT)**.

### **MVP Goal**
To build a working backend that allows:
1. Users (companies or individuals) to register and manage their profiles.
2. Record incomes and deductible expenses.
3. Automatically calculate estimated taxes (CIT/PIT).
4. Generate downloadable tax summary reports.
5. Schedule automated tax reminders and notifications.

### **1. Authentication & User Roles**
**User Types:**
- Individual (Personal Income Tax)
- Company (Company Income Tax)

**Endpoints:**
- `POST /auth/sign_up`
- `POST /auth/sign_in`

**Implementation:**
- JWT-based authentication
- Password hashing with bcrypt

**Data Fields:**
`fullname`, `email`, `password`, `role`, `businessName` (for business accounts)

### **2. Income & Expense Recording**
Users can add, view, and delete income and expense records.

**Database Fields:**
- `user_id`, `type (income | expense)`, `amount`, `description`, `date`, `is_deductible`

This data forms the base for tax computation.
### **3. Tax Computation Engine**
Core tax logic is implemented in the backend service layer.

**Formula:**
taxable_income = total_income - deductible_expenses
tax_payable = applyTaxRate(taxable_income, user.role)


**Tax Rules:**
- **CIT:**  
  - 20% for companies with < ₦100M turnover  
  - 30% for companies with ≥ ₦100M turnover  
- **PIT:** Progressive brackets (7% – 24%) per Nigeria’s PIT Act

---

### **4. Tax Scheduler & Reminders**
Automated scheduling using **node-cron**.

**Use Cases:**
- Monthly or quarterly tax payment alerts
- Filing deadline reminders

Example: sends an email every 30 days with tax summary and next due date.

### **5. Report Generation (PDF/CSV)**
Users can download detailed reports within a date range.

**Sample Endpoint:**
`GET /api/report/download?format=pdf&type=summary&from=2025-01-01&to=2025-01-31`

**Report Fields:**
- Total Income  
- Total Deductible Expenses  
- Taxable Income  
- Tax Payable  

Generated using **pdfkit** or **csv-writer**.

### **6. Database Schema (MySQL + Sequelize ORM)**
**Tables:**
1. **Users:** `user_id`, `fullname`, `email`, `role`, `password`, `businessName`
2. **Transactions:** `transaction_id`, `user_id`, `type`, `amount`, `description`, `is_deductible`, `date`
3. **TaxRecords:** `record_id`, `user_id`, `tax_type`, `taxable_income`, `tax_amount`, `created_at`
4. **Reminders:** `reminder_id`, `user_id`, `message`, `frequency`, `next_trigger`

### **7. Security & Best Practices**
- Input validation (express-validator)
- Password hashing (bcrypt)
- SQL injection prevention (Sequelize ORM)
- Environment-based secrets (dotenv)
- Basic rate limiting (express-rate-limit)
- Protected routes via JWT


## Tech Stack

| Category | Technology |
|-----------|-------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | **MySQL + Sequelize ORM** |
| Authentication | JWT + Bcrypt |
| Scheduler | Node-cron |
| Email | Nodemailer |
| Reports | pdfkit |
| Environment | Dotenv |

## Base URL

| Environment | URL |
|--------------|---------------------------------------------|
| **Production (Live)** | https://tax-tracker-backend.onrender.com |
| **Local Development** | http://localhost:5000 |

> Tip: Append any route to the base URL to test directly.  
> Example:  
> `https://tax-tracker-backend.onrender.com/api/auth/sign_in`


##  Folder Structure
.
TAX-TRACKER-BACKEND
├─ server.js
├─ package.json
├─ README.md
├─ node_modules/
└─ src/
├─ config/
│ └─ db.js
├─ controllers/
│ ├─ auth.controller.js
│ ├─ income.expense.controller.js
│ ├─ transaction.controller.js
│ ├─ tax.controller.js
│ ├─ otp.controller.js
│ ├─ password.controller.js
│ ├─ reminder.controller.js
│ └─ report.controller.js
├─ routes/
│ ├─ auth.routes.js
│ ├─ transaction.routes.js
│ ├─ income.expense.routes.js
│ ├─ reminder.routes.js
│ ├─ report.routes.js
│ └─ tax.routes.js
├─ services/
│ ├─ auth.service.js
│ ├─ email.service.js
│ ├─ transaction.service.js
│ ├─ income.expense.service.js
│ ├─ otp.service.js
│ ├─ reminder.service.js
│ ├─ report.service.js
│ ├─ sms.service.js
│ ├─ tax.service.js
│ └─ tax.summary.service.js
├─ models/
│ ├─ index.js
│ ├─ user.model.js
│ ├─ transaction.model.js
│ ├─ income.expense.model.js
│ ├─ business.profile.js
│ ├─ reminder.model.js
│ ├─ notification.model.js
│ └─ tax.record.model.js
├─ middlewares/
│ ├─ auth.middleware.js
│ └─ role.middleware.js
├─ jobs/
│ └─ reminder.cron.js
└─ utils/
├─ tax.utils.js
├─ transaction.utils.js
├─ validators.js
├─ generate.token.js
└─ report.utils.js
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
| Mungathia Nancy Karimi | Backend Developer             |
| Claudia Bose Olawale   | Backend Developer             |

Author



 License
