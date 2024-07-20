const { Router } = require("express");
const SessionsController = require("../controllers/SessionsController");
const sessionsController = new SessionsController();

const sessionsRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: User sessions
 */

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a new session (login)
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session created successfully
 */
sessionsRoutes.post("/", sessionsController.create);

module.exports = sessionsRoutes;
