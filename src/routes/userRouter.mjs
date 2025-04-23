import { Router } from 'express';
const router = Router();
// verify
import authVerify from '../middleware/auth.mjs';
// controller
import UserController from '../app/controller/UserController.mjs';
//-----------------------------------------------------------

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Retrieve all users
 *     description: Retrieve a list of all users in the system.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       fullName:
 *                         type: string
 *                       phoneNumber:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
router.get('/', authVerify, UserController.getAllUser);

/**
 * @swagger
 * /api/v1/users/{_id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: The ID of the user to retrieve.
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:_id', authVerify, UserController.getSingleUser);

/**
 * @swagger
 * /api/v1/users/delete/{_id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Delete a user by their ID.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:_id', authVerify, UserController.deleteUserById);

/**
 * @swagger
 * /api/v1/users/update/{_id}:
 *   patch:
 *     summary: Update user information
 *     description: Update the information of a specific user by their ID.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: New full name of the user.
 *               phoneNumber:
 *                 type: string
 *                 description: New phone number of the user.
 *     responses:
 *       200:
 *         description: User information updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch('/update/:_id', authVerify, UserController.updateInfo);

/**
 * @swagger
 * /api/v1/users/update-password:
 *   patch:
 *     summary: Update user password
 *     description: Update the password of the currently logged-in user.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The user's old password.
 *               newPassword:
 *                 type: string
 *                 description: The user's new password.
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid old password or new password
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch('/update-password', authVerify, UserController.updatePassword);

export default router;
