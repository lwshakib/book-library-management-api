import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { MONGODB_URI } from "../envs.js";
import logger from "../logger/winston.logger.js";

const teardown = async () => {
  try {
    logger.info("Connecting to MongoDB for teardown...");
    await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
    
    logger.info(`Dropping database: ${DB_NAME}...`);
    await mongoose.connection.db.dropDatabase();
    
    logger.info("Database dropped successfully.");
    await mongoose.connection.close();
    logger.info("Connection closed.");
    process.exit(0);
  } catch (error) {
    logger.error("Error during MongoDB teardown:", error);
    process.exit(1);
  }
};

teardown();
