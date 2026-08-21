import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import logger from "../logger/winston.logger.js";
import { MONGODB_URI } from "../envs.js";

export class MongoDBService {
  constructor() {
    this.dbInstance = null;
  }

  async connect() {
    try {
      const connectionInstance = await mongoose.connect(
        `${MONGODB_URI}/${DB_NAME}`,
      );
      this.dbInstance = connectionInstance;
      logger.info("\n☘️  MongoDB Connected successfully!\n");
      return connectionInstance;
    } catch (error) {
      logger.error("MongoDB connection error: ", error);
      process.exit(1);
    }
  }
}

export const mongoDBService = new MongoDBService();
