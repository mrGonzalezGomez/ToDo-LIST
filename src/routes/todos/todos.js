const express = require('express');
const router = express.Router();
const todosQuery = require('./todos.query');
const authMiddleware = require('../../middleware/auth');

function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return null;  // Return null or a default value if the date is invalid
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

router.get('/:id', authMiddleware, async (req, res, next) => {
    try {
        const todo = await todosQuery.getTodoById(req.params.id);
        if (todo) {
            if (todo.due_time) {
                todo.due_time = formatDate(new Date(todo.due_time));
            }
            if (todo.created_at) {
                todo.created_at = formatDate(new Date(todo.created_at));
            }
            res.json(todo);
        } else {
            res.status(404).json({ msg: 'Todo not found' });
        }
    } catch (error) {
        next(error);
    }
});

router.put('/:id', authMiddleware, async (req, res, next) => {
    const { title, description, due_time, user_id, status } = req.body;
    
    try {
        const updatedTodo = await todosQuery.updateTodo(req.params.id, { title, description, due_time, user_id, status });
        if (updatedTodo.affectedRows === 0) {
            return res.status(404).json({ msg: 'Todo not found' });
        }
        const todo = await todosQuery.getTodoById(req.params.id);
        if (todo.due_time) {
            todo.due_time = formatDate(new Date(todo.due_time));
        }
        if (todo.created_at) {
            todo.created_at = formatDate(new Date(todo.created_at));
        }
        res.json(todo);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const result = await todosQuery.deleteTodo(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Todo not found' });
        }
        res.json({ msg: `Successfully deleted record number: ${req.params.id}` });
    } catch (error) {
        next(error);
    }
});

router.post('/', authMiddleware, async (req, res, next) => {
    const { title, description, due_time, user_id, status } = req.body;
    
    try {
        const newTodo = await todosQuery.createTodo({ title, description, due_time, user_id, status });
        if (newTodo.due_time) {
            newTodo.due_time = formatDate(new Date(newTodo.due_time));
        }
        if (newTodo.created_at) {
            newTodo.created_at = formatDate(new Date(newTodo.created_at));
        }
        res.status(201).json(newTodo);
    } catch (error) {
        next(error);
    }
});

router.get('/', authMiddleware, async (req, res, next) => {
    try {
        const todos = await todosQuery.getAllTodos();
        const formattedTodos = todos.map(todo => ({
            ...todo,
            created_at: todo.created_at ? formatDate(new Date(todo.created_at)) : null,
            due_time: todo.due_time ? formatDate(new Date(todo.due_time)) : null
        }));
        res.json(formattedTodos);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
