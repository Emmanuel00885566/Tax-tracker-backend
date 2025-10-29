import 'dotenv/config';
import express from 'express';
import reportRoutes from './routes/report.routes.js';

const app = express();
app.use(express.json());

app.use('/report', reportRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on :${port}`));