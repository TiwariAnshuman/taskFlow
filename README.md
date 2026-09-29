# TaskFlow API

A RESTful Task Management API built with **Node.js, Express, and MongoDB**.

TaskFlow supports user authentication, personal tasks, filtering, searching, pagination, sorting, and task statistics.

## Features

* JWT authentication
* User registration and login
* Protected API routes
* Create, update, delete and view tasks
* User-specific tasks
* Task status and priority filters
* Search tasks
* Due-date filters
* Pagination and sorting
* Task statistics
* Request validation
* Centralized error handling

## Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT
* bcryptjs
* Express Validator

## Setup

```bash
git clone https://github.com/YOUR_USERNAME/taskflow-api.git
cd taskflow-api
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Start the server:

```bash
npm run dev
```

API runs at:

```text
http://localhost:5000
```

## Main Routes

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/stats
GET    /api/tasks/:id
PUT    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

Most task routes require a JWT token:

```text
Authorization: Bearer <token>
```

## Project Status

Built as a backend project to practice **REST APIs, authentication, MongoDB, middleware, validation, and real-world API structure**.

## Author

**Anshuman Tiwari**
