import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/auth.mjs';
//controller
import KeyController from '../app/controller/KeyController.mjs';
//-----------------------------------------------------------

/**
 * @openapi
 * tags:
 *   name: Keys
 *   description: Key management endpoints
 */

/**
 * @openapi
 * /api/v1/key/get-by-user:
 *   get:
 *     summary: Get all Keys associated with a user
 *     tags: [Keys]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved Keys
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Key:
 *                     type: string
 *                     example: "Hdian6Jb9qan2"
 *                   userID:
 *                     type: string
 *                     example: "60f7aeedb987a842d2c3e1f0"
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get('/get-by-user', authVerify, KeyController.getAllKeysByUserID);

/**
 * @openapi
 * /api/v1/key/generate:
 *   post:
 *     summary: Add a new Key 
 *     tags: [Keys]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *     responses:
 *       '200':
 *         description: Successfully added Key
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.post('/generate', authVerify, KeyController.generateKey);

export default router;
