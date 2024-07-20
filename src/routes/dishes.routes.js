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

/**
 * @swagger
 * tags:
 *   name: Dishes
 *   description: Dish management
 */

/**
 * @swagger
 * /dishes/index:
 *   get:
 *     summary: Get a list of dishes
 *     tags: [Dishes]
 *     responses:
 *       200:
 *         description: List of dishes
 */
dishesRoutes.get("/index", dishesController.index);

/**
 * @swagger
 * /dishes/newdish:
 *   post:
 *     summary: Create a new dish
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Dish created successfully
 */
dishesRoutes.post("/newdish", ensureADMIN, upload.single('image'), dishesController.create);

/**
 * @swagger
 * /dishes/editdish/{id}:
 *   put:
 *     summary: Update an existing dish
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Dish updated successfully
 */
dishesRoutes.put("/editdish/:id", ensureADMIN, upload.single('image'), dishesController.update);

/**
 * @swagger
 * /dishes/{id}:
 *   delete:
 *     summary: Delete a dish
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dish deleted successfully
 */
dishesRoutes.delete("/:id", ensureADMIN, dishesController.delete);

/**
 * @swagger
 * /dishes/{id}:
 *   get:
 *     summary: Get a dish by ID
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dish details
 */
dishesRoutes.get("/:id", dishesController.show);

module.exports = dishesRoutes;
