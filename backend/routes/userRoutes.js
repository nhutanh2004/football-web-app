const express = require('express');
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route: Create a user
router.post('/', createUser);

// Admin-only route: Get all users
router.get('/', authenticate, authorizeAdmin, getAllUsers);

// Protected route: Get a specific user (admin or the user themselves)
router.get('/:id', authenticate, getUserById);

// Protected route: Update a user (admin or the user themselves)
router.put('/:id', authenticate, updateUser);

// Admin-only route: Delete a user
router.delete('/:id', authenticate, authorizeAdmin, deleteUser);

module.exports = router;