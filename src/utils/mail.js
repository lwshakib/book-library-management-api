import { Queue } from "bullmq";
import logger from "../logger/winston.logger.js";

const mailQueue = new Queue("mailQueue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

export const sendMail = async (purpose, context) => {
  const result = await mailQueue.add("sendMail", {
    to: process.env.MAIL_TO,
    purpose,
    context,
  });
  logger.info(
    `Mail job added to queue with ID: ${
      result.id
    }, Purpose: ${purpose}}`
  );
};
