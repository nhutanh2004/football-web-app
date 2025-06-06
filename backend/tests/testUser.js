const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB connection string
const connStr = 'mongodb://localhost:27017/footballDB';

mongoose.connect(connStr, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

const runTest = async () => {
    try {
        // Create a new user
        const testUser = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: 'Nhutanh@123!',
            isAdmin: true,
            role: 'admin',
        });

        // Save the user to the database
        await testUser.save();
        console.log('User saved successfully');

        // Fetch the user and test password verification
        const user = await User.findOne({ username: 'admin' });
        if (!user) {
            console.error('User not found');
            return;
        }

        // Test a matching password
        user.comparePassword('Nhutanh@123!', (err, isMatch) => {
            if (err) throw err;
            console.log('Nhutanh@123!:', isMatch); // -> Password123: true
        });

        // Test a failing password
        user.comparePassword('WrongPassword', (err, isMatch) => {
            if (err) throw err;
            console.log('WrongPassword:', isMatch); // -> WrongPassword: false
        });
    } catch (err) {
        console.error('Error during test:', err.message);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
};

runTest();