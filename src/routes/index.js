const { Router } = require("express");

const usersRouter = require("./users.routes");
const dishesRouter = require("./dishes.routes");
const sessionsRoutes = require("./sessions.routes");

const routes = Router();

routes.use("/sessions", sessionsRoutes);
routes.use("/users", usersRouter);
routes.use("/dishes", dishesRouter);

module.exports = routes;