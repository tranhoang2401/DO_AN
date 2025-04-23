import { Router } from 'express';
const router = Router();
// verify
import authVerify from '../middleware/auth.mjs';
// controller
import HistoryController from '../app/controller/HistoryController.mjs';
//-----------------------------------------------------------

/**
 * @swagger
 * /api/v1/history:
 *   get:
 *     summary: Retrieve all history
 *     description: Retrieve a list of all history in the system.
 *     tags:
 *       - History
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       
 *       500:
 *         description: Internal server error
 */
router.get('/get-by-user', authVerify, HistoryController.getAllHistoryByUser);

/**
 * @swagger
 * /api/v1/history/{_id}:
 *   get:
 *     summary: Retrieve a history by ID
 *     description: Retrieve a history by their ID.
 *     tags:
 *       - History
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: The ID of the history to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 history:
 *                   type: object
 *                   properties:
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:_id', authVerify, HistoryController.getSingleHistory);

export default router;
