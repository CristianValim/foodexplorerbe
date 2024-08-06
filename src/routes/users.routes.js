const { Router } = require("express");
const UsersController = require("../controllers/UsersController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const usersRoutes = Router();
const usersController = new UsersController();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: securepassword
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad Request - Missing required fields
 *       409:
 *         description: Conflict - Email already registered
 */
usersRoutes.post("/", usersController.create);

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane.doe@example.com
 *               password:
 *                 type: string
 *                 example: newsecurepassword
 *               old_password:
 *                 type: string
 *                 example: oldsecurepassword
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad Request - Missing fields or incorrect old password
 *       404:
 *         description: Not Found - User not found
 *       409:
 *         description: Conflict - Email already in use
 */
usersRoutes.put("/", ensureAuthenticated, usersController.update);

/**
 * @swagger
 * /users/favorite:
 *   post:
 *     summary: Add or remove a dish from favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dish_id
 *             properties:
 *               dish_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Favorite removed successfully if it already exists
 *       201:
 *         description: Favorite added successfully if it did not exist
 *       500:
 *         description: Internal Server Error - Failed to toggle favorite
 */
usersRoutes.post("/favorite", ensureAuthenticated, usersController.favorite);

/**
 * @swagger
 * /users/favorites:
 *   get:
 *     summary: Get the list of favorite dishes for the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of favorite dishes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dish_id:
 *                     type: integer
 *                     example: 1
 *       500:
 *         description: Internal Server Error - Failed to fetch favorites
 */
usersRoutes.get("/favorites/:id", ensureAuthenticated, usersController.getFavorites);

module.exports = usersRoutes;
