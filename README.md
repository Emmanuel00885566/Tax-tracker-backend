# Tax Tracker Backend

The **Tax Tracker Backend** provides secure endpoints for managing users, income and expenses, tax computations, reminders, and financial reports.  
It supports both **individual** and **business** accounts, includes OTP verification, and provides ready endpoints for frontend integration.
---

##  Core Features

###  User Authentication Management 
- Register and login securely using JWT.
- Password hashing with bcrypt.
###  Income & Expense Management
- Create, read, update, and delete (CRUD) transactions.
- Categorize transactions as **income** or **expense**.
- Mark expenses as **deductible**.
- Auto-calculate total income, total expense, and total deductible amounts.

###  Tax Computation
- Automatically compute **taxable income** = income − deductible expenses.
- Apply tax rates dynamically 
- Compute total tax owed per user.

###  Email Service
- Send email notifications for registration, reminders, or report generation.
- Configurable via third-party services (e.g. Nodemailer).

###  Reminder System
- Schedule reminders for filing taxes or upcoming payments.
- Uses **Node-cron**  scheduler for automated alerts.

###  Report Generation
- Generate PDF or CSV reports summarizing:
  - Income and expense data
  - Tax calculations
  - Monthly summaries
- Reports can be sent via email or downloaded.



## Tech Stack

| Category | Technology |
|-----------|-------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL / Sequelize |
| Authentication | JWT + Bcrypt |
| Scheduler | Node-cron |
| Email | Nodemailer |
| Reports | pdfkit  |
| Environment | Dotenv |

---

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


Author
🔗 GitHub Profile


 License



