const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const userQuery = require('./user.query');
const authMiddleware = require('../../middleware/auth');
const { getUserByEmail } = require('./user.query');

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

router.get('/', authMiddleware, async (req, res, next) => {
    try {
        const users = await getUserByEmail(req.userEmail);
        const formattedUsers = {
            id: users.id,
            email: users.email,
            password: users.password,
            created_at: formatDate(new Date(users.created_at)),
            firstname: users.firstname,
            name: users.name
        };
        res.json(formattedUsers);
    } catch (error) {
        next(error);
    }
});

const getUserTodosHandler = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const todos = await userQuery.getUserTodos(userId);
        res.json(todos);
    } catch (error) {
        next(error);
    }
};

router.get('/todos', authMiddleware, getUserTodosHandler);

router.get('/:param', authMiddleware, async (req, res, next) => {
    const param = req.params.param;
    try {
        let user;
        if (isNaN(param)) {
            user = await userQuery.getUserByEmail(param);
        } else {
            user = await userQuery.getUserById(param);
        }
        if (user) {
            res.json({
                id: user.id,
                email: user.email,
                password: user.password,
                created_at: formatDate(new Date(user.created_at)),
                firstname: user.firstname,
                name: user.name
            });
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
});

router.put('/:id', authMiddleware, async (req, res, next) => {
    const { email, password, firstname, name } = req.body;

    try {
        const user = await userQuery.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        let hashedPassword = user.password;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const updatedUserData = {
            email,
            password: hashedPassword,
            firstname,
            name
        };

        await userQuery.updateUser(req.params.id, updatedUserData);

        const updatedUser = await userQuery.getUserById(req.params.id);

        res.json({
            id: updatedUser.id,
            email: updatedUser.email,
            password: updatedUser.password,
            created_at: updatedUser.created_at,
            firstname: updatedUser.firstname,
            name: updatedUser.name
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const result = await userQuery.deleteUser(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ msg: `Successfully deleted record number: ${req.params.id}` });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
