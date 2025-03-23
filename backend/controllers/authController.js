const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // Compare the provided password with the hashed password in the database
        user.comparePassword(password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(400).json({ message: 'Invalid username or password.' });
            }

            // Generate a JWT token
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin }, // Include isAdmin in the token payload
                process.env.JWT_SECRET || 'defaultsecret',
                { expiresIn: '1h' }
            );

            // Include isAdmin in the response
            res.json({ token, isAdmin: user.isAdmin });
        });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};