import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
    },
  pool: {
    max: 5,       
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
   
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

export default sequelize;
