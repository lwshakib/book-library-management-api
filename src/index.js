import { httpServer } from "./app.js";
import { mongoDBService } from "./services/mongodb.services.js";
import logger from "./logger/winston.logger.js";
import { PORT, NODE_VERSION } from "./envs.js";
const port = PORT || 3000;

const majorNodeVersion = +(NODE_VERSION?.split(".")[0]) || 0;

const startServer = () => {
  httpServer.listen(port || 8080, () => {
    logger.info(
      `📑 Visit the documentation at: http://localhost:${port || 8080}/`,
    );
    logger.info("⚙️  Server is running on port: " + PORT);
  });
};

if (majorNodeVersion >= 14) {
  try {
    await mongoDBService.connect();
    startServer();
  } catch (err) {
    logger.error("Mongo db connect error: ", err);
  }
} else {
  mongoDBService.connect()
    .then(() => {
      startServer();
    })
    .catch((err) => {
      logger.error("Mongo db connect error: ", err);
    });
}
