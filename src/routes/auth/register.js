const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../../config/db');

dotenv.config();

const router = express.Router();

router.post('/', async (req, res, next) => {
    const { email, name, firstname, password } = req.body;
    if (!email || !name || !firstname || !password) {
        console.log(req.body);
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    try {
        const existingUser = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
                if (error) return reject(error);
                resolve(results.length > 0 ? results[0] : null);
            });
        });

        if (existingUser) {
            return res.status(400).json({ msg: 'Account already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await new Promise((resolve, reject) => {
            db.query('INSERT INTO user (email, name, firstname, password) VALUES (?, ?, ?, ?)', 
                [email, name, firstname, hashedPassword], 
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });

        const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
