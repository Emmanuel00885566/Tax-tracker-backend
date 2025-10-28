import { Sequelize } from "sequelize";
import config from "./index.js"

const sequelize = new Sequelize(
    config.DB_NAME,
    config.DB_USER,
    config.DB_PASSWORD,
    {
        dialect: config.DB_DIALECT,
        port: config.DB_PORT,
        host: config.DB_HOST,
        logging: false,
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true});
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database error detected:", error);
    }
};

export default sequelize;