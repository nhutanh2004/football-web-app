const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
        req.user = decoded; // Attach user info to the request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

exports.authorizeAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }
    next();
};
exports.authorizeCustom = ({ allowAdmins = [], denyAdmins = [] } = {}) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Nếu là admin bị cấm quyền này
        if (user.isAdmin && denyAdmins.includes(user.role)) {
            return res.status(403).json({ message: 'Action not allowed for your admin level' });
        }

        // Nếu là admin hợp lệ (theo allow list)
        if (user.isAdmin && allowAdmins.includes(user.role)) {
            return next();
        }

        // Nếu không phải admin thì từ chối
        return res.status(403).json({ message: 'Only admins can perform this action' });
    };
};
