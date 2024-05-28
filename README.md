# EPYTODO Project

## Overview
The EPYTODO project involves building a Todo List application with a focus on the backend. The primary objective is to create a REST API using Node.js and MySQL to manage users and their respective tasks.

## Project Details

- **Project Name:** EPYTODO
- **Language:** Node.js

### Key Components
1. **MySQL Database**
2. **Node.js Web Server**

## Database

### Schema
Create a file named `epytodo.sql` at the root of your repository containing the entire database schema. The database must be named `epytodo` and should include the following tables:

#### User Table
- **id:** INT, not null, auto-increments
- **email:** VARCHAR, not null, unique
- **password:** VARCHAR, not null
- **name:** VARCHAR, not null
- **firstname:** VARCHAR, not null
- **created_at:** DATETIME, default to the current datetime

#### Todo Table
- **id:** INT, not null, auto-increments
- **title:** VARCHAR, not null
- **description:** VARCHAR, not null
- **created_at:** DATETIME, default to the current datetime
- **due_time:** DATETIME, not null
- **status:** ENUM('not started', 'todo', 'in progress', 'done'), default to 'not started'
- **user_id:** INT, not null, foreign key referencing `user.id`

### Importing the Schema
To import your schema into your MySQL server:
```sh
cat epytodo.sql | mysql -u root -p
```
Ensure your SQL file is placed in the root folder and do not insert any records into this file.

## Web Server

### Environment Variables
The `.env` file should contain the following configuration variables:
- `MYSQL_DATABASE`
- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_ROOT_PASSWORD`
- `PORT` (for the Express server)
- `SECRET` (for JSON Web Token)

### Dependencies
You are limited to the following npm packages:
- `express`
- `mysql2`
- `dotenv`
- `jsonwebtoken`
- `bcryptjs`
- `body-parser` (optional)

### API Endpoints
Your API should handle the following routes:

#### User Routes
- **POST /register:** Register a new user
- **POST /login:** Log in a user
- **GET /user:** View all user information (protected)
- **GET /user/todos:** View all user tasks (protected)
- **GET /users/:id or /users/:email:** View user information (protected)
- **PUT /users/:id:** Update user information (protected)
- **DELETE /users/:id:** Delete user (protected)

#### Todo Routes
- **GET /todos:** View all todos (protected)
- **GET /todos/:id:** View a specific todo (protected)
- **POST /todos:** Create a new todo (protected)
- **PUT /todos/:id:** Update a specific todo (protected)
- **DELETE /todos/:id:** Delete a specific todo (protected)

### Route Protection
Protected routes should only be accessible to logged-in users. Use JSON Web Token (JWT) for authentication, passing the token in the Authorization header.

### Error Handling
Implement a custom error handler middleware. Common error responses include:
- **No token:** `{ "msg": "No token, authorization denied" }`
- **Invalid token:** `{ "msg": "Token is not valid" }`
- **Not found:** `{ "msg": "Not found" }`
- **Bad parameter:** `{ "msg": "Bad parameter" }`
- **Internal server error:** `{ "msg": "Internal server error" }`

## Conclusion
The EPYTODO project aims to develop a backend for a Todo List application using Node.js and MySQL. Follow the provided structure and guidelines to ensure a clean and maintainable codebase. Optionally, enhance your project by adding a frontend.
