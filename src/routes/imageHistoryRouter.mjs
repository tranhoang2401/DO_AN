import { Router } from 'express';
const router = Router();
// verify
import authVerify from '../middleware/auth.mjs';
// controller
import ImageHistoryController from '../app/controller/ImageHistoryController.mjs';
//-----------------------------------------------------------

/**
 * @swagger
 * /api/v1/image-history:
 *   get:
 *     summary: Retrieve all images
 *     description: Retrieve a list of all images in the system.
 *     tags:
 *       - ImageHistory
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       
 *       500:
 *         description: Internal server error
 */
router.get('/get-by-user', authVerify, ImageHistoryController.getAllImageHistoryByUser);

/**
 * @swagger
 * /api/v1/image-history/{_id}:
 *   get:
 *     summary: Retrieve a image by ID
 *     description: Retrieve a image by their ID.
 *     tags:
 *       - ImageHistory
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: The ID of the image to retrieve.
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
 *                 image:
 *                   type: object
 *                   properties:
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:_id', authVerify, ImageHistoryController.getSingleImageHistory);

export default router;
