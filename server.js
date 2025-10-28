import express from 'express';
import { syncDB } from './src/models/index.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


app.get('/', async (req, res) => {
  await syncDB();
  res.json({ 
    message: 'Tax Tracker API - Database Synced!', 
    status: 'success' 
  });
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await syncDB(); 
});