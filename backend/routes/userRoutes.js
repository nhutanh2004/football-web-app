const express = require('express');
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/userController');
const { authenticate, authorizeAdmin,authorizeCustom } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route: Create a user
router.post('/', createUser);

// Admin-only route: Get all users
router.get('/', authenticate, authorizeAdmin, getAllUsers);

// Protected route: Get a specific user (admin or the user themselves)
router.get('/:id', authenticate, authorizeCustom, getUserById);

// Chỉ admin có role là "admin" mới được xóa
router.delete('/:id', authenticate, authorizeCustom({ allowAdmins: ['admin'] }), deleteUser);

// Chỉ "admin" mới được sửa thông tin người dùng khác
router.put('/:id', authenticate, async (req, res, next) => {
    const user = req.user;
    const { id } = req.params;
    if (user.id === id) return next();

    if (user.id !== id) {
        if (user.isAdmin && user.role !== 'admin') {
            return res.status(403).json({ message: 'Your admin level cannot edit other users' });
        }
    }

    next(); // OK
}, updateUser);


module.exports = router;