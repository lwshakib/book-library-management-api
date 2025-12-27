import { httpServer } from "./app.js";
import connectDB from "./db/index.js";
import logger from "./logger/winston.logger.js";


const port = process.env.PORT || 3000;

const majorNodeVersion = +process.env.NODE_VERSION?.split(".")[0] || 0;

const startServer = () => {
  httpServer.listen(port || 8080, () => {
    logger.info(
      `📑 Visit the documentation at: http://localhost:${port || 8080}/`
    );
    logger.info("⚙️  Server is running on port: " + process.env.PORT);
  });
};

if (majorNodeVersion >= 14) {
  try {
    await connectDB();
    startServer();
  } catch (err) {
    logger.error("Mongo db connect error: ", err);
  }
} else {
  connectDB()
    .then(() => {
      startServer();
    })
    .catch((err) => {
      logger.error("Mongo db connect error: ", err);
    });
}
