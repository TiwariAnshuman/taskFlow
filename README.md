TaskFlow API

TaskFlow is a REST API for a task management application built with
Node.js, Express, MongoDB, JWT authentication, and request validation.

Features

User registration and login

JWT-based authentication

Get and update the current user

Change password

Delete account and associated tasks

Create, read, update, and delete tasks

User-specific task access

Task validation

Status and priority filtering

Due-date filtering

Text search

Pagination

Sorting

Task statistics

Centralized success/error response structure

Request logging

Global error handling

CORS configuration

Tech Stack

Node.js

Express 5

MongoDB

Mongoose

JSON Web Token (jsonwebtoken)

bcryptjs

express-validator

CORS

dotenv

Nodemon

API Base URL

http://localhost:5000/api

Project Structure

TaskFlow-api/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── authValidation.js
│   │   ├── errorHandler.js
│   │   ├── requestLogger.js
│   │   ├── taskValidation.js
│   │   └── validationResult.js
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   └── response.js
│   └── server.js
├── .env
├── package.json
└── README.md

Installation

Clone or open the project, then install dependencies:

npm install

Environment Variables

Create a .env file in the project root:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskFlow_db
JWT_SECRET=your_jwt_secret

The application uses:

PORT --- server port. Defaults to 5000 if not provided.

MONGO_URI --- MongoDB connection string.

JWT_SECRET --- secret used to sign and verify JWT tokens.

Do not commit real secrets to a public repository.

Running the API

Development

npm run dev

This runs:

nodemon src/server.js

Production-style start

npm start

This runs:

node src/server.js

When the server starts successfully:

Server running on http://localhost:5000

CORS

The API currently allows requests from:

http://localhost:5173

This is the local frontend development origin used by TaskFlow.

Authentication

TaskFlow uses JWT authentication.

After a successful login, the API returns a token.

For protected endpoints, send the token in the request header:

Authorization: Bearer <your_jwt_token>

The authentication middleware verifies the token and places the decoded
user information on:

req.user

The user's ID is available as:

req.user.userId

Authentication Flow

Register / Login
       ↓
JWT token
       ↓
Authorization: Bearer <token>
       ↓
authMiddleware
       ↓
req.user.userId
       ↓
User-specific API access

Auth API

1. Register User

POST /api/auth/register

Request Body

{
  "name": "Anshuman",
  "email": "anshuman@example.com",
  "password": "password123"
}

Validation

Field        Required   Rules

name       Yes        Minimum 2 characters
email      Yes        Must be a valid email
password   Yes        Minimum 6 characters

Success Response

Status: 201 Created

{
  "success": true,
  "message": "user registered successfully",
  "user": {
    "id": "USER_ID",
    "name": "Anshuman",
    "email": "anshuman@example.com"
  }
}

The password is hashed before being stored.

Existing User

Status: 400 Bad Request

{
  "success": false,
  "message": "user already exists"
}

2. Login User

POST /api/auth/login

Request Body

{
  "email": "anshuman@example.com",
  "password": "password123"
}

Success Response

Status: 200 OK

{
  "success": true,
  "message": "login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "Anshuman",
    "email": "anshuman@example.com"
  }
}

The JWT expires after 7 days.

Invalid Credentials

Status: 401 Unauthorized

{
  "success": false,
  "message": "invalid email or password"
}

3. Get Current User

GET /api/auth/me

Authentication

Required.

Authorization: Bearer <your_jwt_token>

Success Response

Status: 200 OK

{
  "success": true,
  "message": "current user fetched successfully",
  "data": {
    "id": "USER_ID",
    "name": "Anshuman",
    "email": "anshuman@example.com"
  }
}

The password is not returned.

4. Update Current User

PATCH /api/auth/me

Authentication

Required.

Request Body

{
  "name": "Anshuman Tiwari"
}

Validation

name is required.

Leading/trailing whitespace is removed.

Name must contain at least 2 characters.

Success Response

Status: 200 OK

{
  "success": true,
  "message": "profile updated successfully",
  "data": {
    "id": "USER_ID",
    "name": "Anshuman Tiwari",
    "email": "anshuman@example.com"
  }
}

5. Change Password

PATCH /api/auth/change-password

Authentication

Required.

Request Body

{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}

Rules

Both passwords are required.

New password must contain at least 6 characters.

New password must be different from the current password.

Current password must be correct.

Success Response

Status: 200 OK

{
  "success": true,
  "message": "password changed successfully"
}

Incorrect Current Password

Status: 401 Unauthorized

{
  "success": false,
  "message": "current password is incorrect"
}

6. Delete Account

DELETE /api/auth/me

Authentication

Required.

Behavior

Deleting the account also deletes all tasks belonging to that user.

Success Response

Status: 200 OK

{
  "success": true,
  "message": "account deleted successfully",
  "data": {
    "deletedTasks": 3
  }
}

Task API

All task endpoints require authentication.

Authorization: Bearer <your_jwt_token>

Tasks are associated with the currently authenticated user.

Task Data Structure

A task contains:

Field           Type       Description

title         String     Task title
description   String     Task description
status        String     Task status
priority      String     Task priority
dueDate       Date       Optional due date
user          ObjectId   Owner of the task
createdAt     Date       Creation timestamp
updatedAt     Date       Last update timestamp

Allowed Status Values

pending
in-progress
completed

Allowed Priority Values

low
medium
high

1. Create Task

POST /api/tasks

Request Body

{
  "title": "Learn Backend",
  "description": "Build TaskFlow API",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2026-09-30"
}

Validation

Field           Required   Rules

title         Yes        Minimum 3 characters
description   No         Maximum 500 characters
status        No         pending, in-progress, completed
priority      No         low, medium, high
dueDate       No         Must be a valid ISO 8601 date

Success Response

Status: 201 Created

{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "TASK_ID",
    "title": "Learn Backend",
    "description": "Build TaskFlow API",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2026-09-30T00:00:00.000Z",
    "user": {
      "_id": "USER_ID",
      "name": "Anshuman",
      "email": "anshuman@example.com"
    },
    "createdAt": "DATE",
    "updatedAt": "DATE"
  }
}

2. Get All Tasks

GET /api/tasks

Authentication

Required.

Default Values

page = 1
limit = 5
sort = createdAt
sortOrder = desc

Query Parameters

Parameter                           Description

status                            Filter by task status. Multiple
statuses can be comma-separated

priority                          Filter by priority

dueDate                           Filter tasks for an exact date

dueDateFilter                     Filter by
today/upcoming/overdue/no-date

search                            Case-insensitive search in title
and description

page                              Page number

limit                             Number of tasks per page

sort                              Sort field

sortOrder                         asc or desc

Status Filter

GET /api/tasks?status=pending

Multiple statuses:

GET /api/tasks?status=pending,in-progress

Allowed values:

pending
in-progress
completed

Priority Filter

GET /api/tasks?priority=high

Allowed values:

low
medium
high

Exact Due Date

GET /api/tasks?dueDate=2026-09-30

Due Date Filters

Today

GET /api/tasks?dueDateFilter=today

Upcoming

GET /api/tasks?dueDateFilter=upcoming

Upcoming tasks exclude completed tasks.

Overdue

GET /api/tasks?dueDateFilter=overdue

Overdue tasks exclude completed tasks.

No Due Date

GET /api/tasks?dueDateFilter=no-date

Search

Search checks both title and description.

GET /api/tasks?search=backend

Search is case-insensitive.

Pagination

GET /api/tasks?page=2&limit=5

Sorting

Allowed sort fields:

createdAt
updatedAt
dueDate
title

Ascending:

GET /api/tasks?sort=title&sortOrder=asc

Descending:

GET /api/tasks?sort=createdAt&sortOrder=desc

Combining Filters

Example:

GET /api/tasks?status=in-progress&priority=high&search=backend&page=1&limit=5&sort=dueDate&sortOrder=asc

Success Response

Status: 200 OK

{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": {
    "page": 1,
    "limit": 5,
    "totalTasks": 10,
    "count": 5,
    "tasks": []
  }
}

3. Get Task Statistics

GET /api/tasks/stats

Authentication

Required.

Success Response

Status: 200 OK

{
  "success": true,
  "message": "Task stats fetched successfully",
  "data": {
    "total": 15,
    "completed": 2,
    "pending": 10,
    "inProgress": 3,
    "overdue": 3
  }
}

Statistics

Field          Meaning

total        Total tasks belonging to the user
completed    Tasks with completed status
pending      Tasks with pending status
inProgress   Tasks with in-progress status
overdue      Tasks whose due date has passed and are not completed

4. Get Single Task

GET /api/tasks/:id

Example:

GET /api/tasks/64f123456789abcdef123456

Authentication

Required.

The task must belong to the authenticated user.

Success Response

Status: 200 OK

{
  "success": true,
  "message": "Task fetched successfully",
  "data": {
    "_id": "TASK_ID",
    "title": "Learn Backend",
    "description": "Build TaskFlow API",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2026-09-30T00:00:00.000Z",
    "user": {
      "_id": "USER_ID",
      "name": "Anshuman",
      "email": "anshuman@example.com"
    }
  }
}

5. Update Task

Task updates are supported through both PUT and PATCH.

PUT /api/tasks/:id

or:

PATCH /api/tasks/:id

Authentication

Required.

Request Body

Only fields supplied in the request are added to the update object.

{
  "title": "Learn Advanced Backend",
  "description": "Continue building TaskFlow",
  "status": "completed",
  "priority": "medium",
  "dueDate": "2026-10-01"
}

Success Response

Status: 200 OK

{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "TASK_ID",
    "title": "Learn Advanced Backend",
    "description": "Continue building TaskFlow",
    "status": "completed",
    "priority": "medium",
    "dueDate": "2026-10-01T00:00:00.000Z"
  }
}

6. Delete Task

DELETE /api/tasks/:id

Authentication

Required.

Success Response

Status: 200 OK

{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "_id": "TASK_ID",
    "title": "Learn Backend"
  }
}

Error Handling

The API uses two response helpers:

sendSuccess()
sendError()

Success Structure

{
  "success": true,
  "message": "Operation successful",
  "data": {}
}

Some authentication responses use user or token directly, according
to the endpoint implementation.

Error Structure

{
  "success": false,
  "message": "Something went wrong",
  "error": null
}

Validation responses can also contain an errors array:

{
  "success": false,
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Title is required",
      "path": "title",
      "location": "body"
    }
  ]
}

Common HTTP Status Codes

Status Meaning

 `200` Request successful
 `201` Resource created
 `400` Bad request / validation error
 `401` Authentication failed or token missing/invalid
 `404` Resource not found

Protected Routes

The following routes require a valid JWT:

GET    /api/auth/me
PATCH  /api/auth/me
PATCH  /api/auth/change-password
DELETE /api/auth/me

POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/stats
GET    /api/tasks/:id
PUT    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id

Testing with Thunder Client

You can test the API using Thunder Client in VS Code.

Step 1 --- Start MongoDB

Make sure your local MongoDB server is running.

Step 2 --- Start TaskFlow API

npm run dev

Step 3 --- Register a User

POST http://localhost:5000/api/auth/register

Body:

{
  "name": "Anshuman",
  "email": "anshuman@example.com",
  "password": "password123"
}

Step 4 --- Login

POST http://localhost:5000/api/auth/login

Body:

{
  "email": "anshuman@example.com",
  "password": "password123"
}

Copy the returned JWT.

Step 5 --- Add Authorization

For protected requests:

Authorization: Bearer YOUR_TOKEN

Step 6 --- Test Tasks

Example:

GET http://localhost:5000/api/tasks

or:

POST http://localhost:5000/api/tasks

Body:

{
  "title": "Build TaskFlow Frontend",
  "description": "Connect the React frontend with the API",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2026-10-01"
}

Security Notes

Passwords are hashed using bcryptjs.

Passwords are not returned by the current-user endpoint.

JWTs are signed using JWT_SECRET.

JWTs expire after 7 days.

Task queries are restricted to the authenticated user's ID.

Account deletion removes the user's associated tasks.

Package Scripts

npm run dev

Starts the development server with Nodemon.

npm start

Starts the server with Node.

Dependencies

bcryptjs
cors
dotenv
express
express-validator
jsonwebtoken
mongoose

Development dependency:

nodemon

TaskFlow API Endpoint Summary

Method   Endpoint                      Auth

POST     /api/auth/register          No
POST     /api/auth/login             No
GET      /api/auth/me                Yes
PATCH    /api/auth/me                Yes
PATCH    /api/auth/change-password   Yes
DELETE   /api/auth/me                Yes
POST     /api/tasks                  Yes
GET      /api/tasks                  Yes
GET      /api/tasks/stats            Yes
GET      /api/tasks/:id              Yes
PUT      /api/tasks/:id              Yes
PATCH    /api/tasks/:id              Yes
DELETE   /api/tasks/:id              Yes

Project Status

TaskFlow API currently includes:

Authentication

User-specific authorization

Task CRUD

Validation

Error handling

Filtering

Search

Pagination

Sorting

Due-date filtering

Task statistics

API response structure

CORS

Request logging

The API is ready to be consumed by the TaskFlow frontend.