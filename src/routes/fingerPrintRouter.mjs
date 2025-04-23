import { Router } from 'express';
const router = Router();

// Middleware xác thực
import authVerify from '../middleware/auth.mjs';

// Controller cho Fingerprint
import FingerprintController from '../app/controller/FingerprintController.mjs';

/**
 * @openapi
 * /api/v1/fingerprint/get-by-user:
 *   get:
 *     summary: Get all fingerprints by user ID
 *     tags:
 *       - Fingerprint
 *     responses:
 *       '200':
 *         description: Successfully retrieved fingerprints
 *       '404':
 *         description: No fingerprints found for this user
 *       '500':
 *         description: Internal server error
 */
router.get('/get-by-user', authVerify, FingerprintController.getAllByUserId);

/**
 * @openapi
 * /api/v1/fingerprint/{_id}:
 *   get:
 *     summary: Get fingerprint by ID
 *     tags:
 *       - Fingerprint
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the fingerprint to retrieve
 *         schema:
 *           type: string
 *           example: "605c72ef153207001f5b1e4"
 *     responses:
 *       '200':
 *         description: Successfully retrieved fingerprint
 *       '404':
 *         description: Fingerprint not found
 *       '500':
 *         description: Internal server error
 */
router.get('/:_id', authVerify, FingerprintController.getById);

/**
 * @openapi
 * /api/v1/fingerprint/update/{_id}:
 *   put:
 *     summary: Update fingerprint by ID
 *     tags:
 *       - Fingerprint
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the fingerprint to update
 *         schema:
 *           type: string
 *           example: "605c72ef153207001f5b1e4"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fingerprint:
 *                 type: string
 *                 example: "updated_base64_fingerprint_data_here"
 *     responses:
 *       '200':
 *         description: Successfully updated fingerprint
 *       '400':
 *         description: Invalid input
 *       '404':
 *         description: Fingerprint not found
 *       '500':
 *         description: Internal server error
 */
router.put('/update/:_id', authVerify, FingerprintController.updateFingerprint);

/**
 * @openapi
 * /api/v1/fingerprint/delete/{_id}:
 *   delete:
 *     summary: Delete fingerprint by ID
 *     tags:
 *       - Fingerprint
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the fingerprint to delete
 *         schema:
 *           type: string
 *           example: "605c72ef153207001f5b1e4"
 *     responses:
 *       '200':
 *         description: Successfully deleted fingerprint
 *       '400':
 *         description: Fingerprint deletion failed
 *       '500':
 *         description: Internal server error
 */
router.delete('/delete/:_id', authVerify, FingerprintController.deleteFingerprint);

export default router;
