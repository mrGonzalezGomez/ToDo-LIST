const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../../config/db');

dotenv.config();

const router = express.Router();

router.post('/', async (req, res, next) => {
    
    
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    try {
        const user = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
                if (error) return reject(error);
                resolve(results.length > 0 ? results[0] : null);
            });
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const token = jwt.sign({ email: user.email }, process.env.SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
