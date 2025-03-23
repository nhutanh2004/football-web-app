const User = require('../models/User');
const bcrypt = require('bcrypt');

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if username or email already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create the user
        const newUser = new User({
            username,
            email,
            password,
            isAdmin: false, // Default to false
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password from response
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

// Get a specific user (admin or the user themselves)
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Allow access if the user is an admin or the user themselves
        if (req.user.id !== id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const user = await User.findById(id).select('-password'); // Exclude password from response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
};

// Update a user (admin or the user themselves)
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, isAdmin } = req.body;

        // Allow updates if the user is an admin or the user themselves
        if (req.user.id !== id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Only admins can update `isAdmin`
        if (isAdmin !== undefined && req.user.isAdmin) {
            user.isAdmin = isAdmin;
        }

        const updatedUser = await user.save();
        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
};