const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const DishesController = require("../controllers/DishesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const ensureADMIN = require("../middlewares/ensureADMIN");

const dishesRoutes = Router();
const dishesController = new DishesController();
const upload = multer(uploadConfig.MULTER);

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.get("/index", dishesController.index);
dishesRoutes.post("/newdish", ensureADMIN, upload.single('image'), dishesController.create);
dishesRoutes.put("/editdish/:id", ensureADMIN, upload.single('image'), dishesController.update);
dishesRoutes.delete("/:id", ensureADMIN, dishesController.delete);
dishesRoutes.get("/:id", dishesController.show);


module.exports = dishesRoutes;
