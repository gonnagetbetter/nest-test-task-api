# NestJS Notes API

A RESTful API built with NestJS that provides authentication, role-based access control, user management, and notes management.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Notes](#notes)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Testing](#testing)
- [Project Structure](#project-structure)

## Features

- **Authentication**: JWT-based authentication with registration and login
- **Role-Based Access Control**: Support for USER and ADMIN roles with different permissions
- **User Management**: CRUD operations for users with role-based restrictions
  - Regular users can only update their own profile
  - Admins have full access to all users
  - Ability to block users (admin only)
  - Blocked users cannot log in
- **Notes Management**: CRUD operations for notes with ownership restrictions
  - Regular users can only manage their own notes
  - Admins can manage all notes
  - Pagination support for fetching notes
- **API Documentation**: Swagger/OpenAPI documentation
- **Validation**: Request validation using Zod
- **Error Handling**: Robust error handling and logging

## Technologies

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [JWT](https://jwt.io/) via @nestjs/jwt
- **Validation**: [Zod](https://zod.dev/) via nestjs-zod
- **API Documentation**: [Swagger/OpenAPI](https://swagger.io/) via @nestjs/swagger
- **Password Hashing**: [bcrypt](https://www.npmjs.com/package/bcrypt)
- **Logging**: [Winston](https://github.com/winstonjs/winston)
- **Containerization**: [Docker](https://www.docker.com/) and Docker Compose

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for running PostgreSQL)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nest-test-task-api
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables as examples:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gatekeeper
   JWT_SECRET=yourSecretKey
   PORT=3000
   ```

4. Start the PostgreSQL database using Docker:
   ```bash
   docker-compose up -d
   ```

## Running the Application

1. Start the application in development mode:
   ```bash
   yarn start:dev
   # or
   npm run start:dev
   ```

2. Build and run the application in production mode:
   ```bash
   yarn build
   yarn start:prod
   # or
   npm run build
   npm run start:prod
   ```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

This provides an interactive UI to explore and test all available API endpoints.

## API Endpoints

### Authentication

- **POST /auth/signUp** - Register a new user
- **POST /auth/signIn** - Login and get JWT token

### Users

- **GET /users/me** - Get current user information
- **PATCH /users/:id** - Update user information
- **PATCH /users/block/:id** - Block a user (Admin only)
- **DELETE /users/:id** - Delete a user
- **GET /users** - Get all users with filtering (Admin only)
- **PATCH /users/role/:id** - Change user role (Admin only)

### Notes

- **GET /notes** - Get notes with pagination
- **POST /notes** - Create a new note
- **PATCH /notes/:id** - Update a note
- **DELETE /notes/:id** - Delete a note

## Environment Variables

- **DATABASE_URL**: PostgreSQL connection string
- **JWT_SECRET**: Secret key for JWT token signing
- **PORT**: Application port (defaults to 3000)

## Database

The application uses PostgreSQL as the database. The database configuration is defined in the `docker-compose.yml` file:

```yaml
version: '3.9'

services:
  db:
    image: postgres:15
    container_name: local-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: gatekeeper
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## Testing

Run tests using the following commands:

```bash
# Unit tests
yarn test
# or
npm run test

# e2e tests
yarn test:e2e
# or
npm run test:e2e

# Test coverage
yarn test:cov
# or
npm run test:cov
```

## Project Structure

```
nest-test-task-api/
├── src/
│   ├── auth/           # Authentication module
│   ├── db/             # Database configuration and schemas
│   ├── logger/         # Logging module
│   ├── notes/          # Notes module
│   ├── users/          # Users module
│   ├── app.module.ts   # Main application module
│   ├── config.ts       # Application configuration
│   └── main.ts         # Application entry point
├── .env                # Environment variables
├── docker-compose.yml  # Docker Compose configuration
├── package.json        # Project dependencies
└── README.md           # Project documentation
```
