const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                throw err;
            }
            req.userEmail = user.email;
            next();
        });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token is invalid' });
        } else {
            return res.status(401).json({ message: 'Token is not valid' });
        }
    }
};

module.exports = auth;
