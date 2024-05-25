const db = require('../../config/db');

const getAllTodos = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM todo', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

const getTodoById = async (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM todo WHERE id = ?', [id], (error, results) => {
            if (error) return reject(error);
            resolve(results.length > 0 ? results[0] : null);
        });
    });
};

const createTodo = async (todoData) => {
    const { title, description, created_at, due_time, user_id, status } = todoData;
    const now = new Date();
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO todo (title, description, created_at, due_time, user_id, status) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, now, due_time, user_id, status],
            (error, results) => {
                if (error) return reject(error);
                resolve({ id: results.insertId, ...todoData, created_at: now });
            }
        );
    });
};

const updateTodo = async (id, todoData) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE todo SET ? WHERE id = ?', [todoData, id], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

const deleteTodo = async (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM todo WHERE id = ?', [id], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

module.exports = { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo };
