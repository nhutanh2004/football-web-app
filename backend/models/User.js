const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'], // Basic email validation
    },
    password: {
        type: String,
        required: true,
        minlength: 10,
        validate: {
            validator: function (value) {
                // Regex to enforce at least one uppercase, one lowercase, one digit, and one special character
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/.test(value);
            },
            message: 'Password must be at least 10 characters long and include uppercase letters, lowercase letters, numbers, and special characters.',
        },
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
    type: String,
    enum: ['user','admin'],
    default: 'user'
    },

});

// Hash the password before saving
UserSchema.pre('save', function (next) {
    const user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // Hash the password using the generated salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // Override the plain-text password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// Compare the provided password with the hashed password
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
