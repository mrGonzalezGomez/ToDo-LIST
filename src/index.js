require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/auth/auth');
const registerRoutes = require('./routes/auth/register');
const loginRoutes = require('./routes/auth/login');
const userRoutes = require('./routes/user/user');
const todoRoutes = require('./routes/todos/todos');
const notFoundMiddleware = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/user', userRoutes);
app.use('/users', userRoutes);
app.use('/todos', todoRoutes);

app.use(notFoundMiddleware);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
