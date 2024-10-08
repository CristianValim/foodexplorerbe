require("express-async-errors");
require("dotenv/config");
const migrationsRun = require("./database/sqlite/migrations/");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");
const DiskStorage = require("./providers/DiskStorage");
const express = require("express");
const routes = require("./routes");
const { swaggerUi, specs } = require("./swagger");
const cors = require("cors");

migrationsRun();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(routes);

app.use((error, request, response, next) => {
  const diskStorage = new DiskStorage();
  if (request.file?.filename) {
    diskStorage.deleteFile(request.file.filename);
  }
  console.error({
    message: error.message,
    stack: error.stack,
    status: error.statusCode || 500,
    request: {
      method: request.method,
      url: request.url,
      body: request.body,
    },
  });
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
