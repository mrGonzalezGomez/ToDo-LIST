const db = require('../../config/db');

const getAllUsers = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

const getUserById = async (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE id = ?', [id], (error, results) => {
            if (error) return reject(error);
            resolve(results.length > 0 ? results[0] : null);
        });
    });
};

const getUserByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
            if (error) return reject(error);
            resolve(results.length > 0 ? results[0] : null);
        });
    });
};

const updateUser = async (id, userData) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE user SET ? WHERE id = ?', [userData, id], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

const deleteUser = async (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM user WHERE id = ?', [id], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

const getUserTodos = async (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM todo WHERE user_id = ?', [id], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

module.exports = { getAllUsers, getUserById, getUserByEmail, updateUser, deleteUser, getUserTodos};
