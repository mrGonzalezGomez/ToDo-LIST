const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

router.post('/', (req, res) => {
    if (!rec.body) return res.status(401).json({ message: 'Cannot be empty' });
    const { email, password } = req.body;
    if (email === 'admin' && password === 'admin') {
        const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
