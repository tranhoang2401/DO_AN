import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/auth.mjs';
//controller
import AuthController from '../app/controller/AuthController.mjs';
//-----------------------------------------------------------

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: 
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       '201':
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged in successfully!"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       '401':
 *         description: Invalid phoneNumber or password
 *       '500':
 *         description: Internal server error
 */
router.post('/login', AuthController.login);

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Log in a user
 *     tags: 
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       '201':
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Register in successfully!"
 *       '401':
 *         description: Invalid phoneNumber or password
 *       '500':
 *         description: Internal server error
 */
router.post('/register', AuthController.register);


/**
 * @openapi
 * /api/v1/auth/account:
 *   get:
 *     summary: Get the current user's profile
 *     tags: 
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved user profile
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.get('/account', authVerify, AuthController.getUserProfile);

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh the access token using a refresh token
 *     tags: 
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       '200':
 *         description: Successfully refreshed access token
 *       '403':
 *         description: Invalid refresh token
 *       '500':
 *         description: Internal server error
 */
router.post('/refresh', AuthController.refreshToken);

export default router;
