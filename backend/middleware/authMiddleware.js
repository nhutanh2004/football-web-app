const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

exports.authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

        // Truy vấn user mới nhất từ DB bằng id trong token
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Gán user thực tế vào req.user để các middleware và controller dùng
        req.user = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            role: user.role,
            // thêm các trường khác nếu cần
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

exports.authorizeAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }
    next();
};
exports.authorizeCustom = ({ allowAdmins = [] } = {}) => {
    return (req, res, next) => {
        const user = req.user;
        const targetId = req.params.id;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (user.isAdmin && !allowAdmins.includes(user.role)) {
            return res.status(403).json({ message: 'Action not allowed for your admin level' });
        }

        if (user.isAdmin && allowAdmins.includes(user.role)) {
            return next();
        }

        // Nếu không phải admin thì từ chối
        return res.status(403).json({ message: 'Only admins can perform this action' });
    };
};
