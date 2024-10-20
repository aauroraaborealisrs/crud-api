# SIMPLE CRUD API

This project is a simple CRUD API built using **Node.js** and **Cluster API** for horizontal scaling. The application supports creating, reading, updating, and deleting users with an in-memory database. The API horizontally scales across multiple CPU cores, distributing requests using a Round-robin algorithm.

## Requirements

- Node.js version 16.x or higher
- Git

## Installation

1. **Clone the repository**:

```bash
git clone https://github.com/aauroraaborealisrs/crud-api.git
```

2. **Checkout the `development` branch**:

```bash
cd crud-api
git checkout development
```

3. **Install dependencies**:

```bash
npm install
```

## Running the Application

The application can be run in two different modes: **development** and **production**, as well as **multi-process** mode for horizontal scaling.

### 1. Development Mode

In development mode, the application runs using `ts-node-dev`, which allows automatic reloading on code changes.

To start the application in development mode, run:

```bash
npm run start:dev
```

This will run the application on port `4000`.

### 2. Production Mode

To run the application in production mode, first build the application:

```bash
npm run start:prod
```

This will run the bundled version of the application on port `4000`.

### 3. Multi-process Mode (Horizontal Scaling)

To start the application with **horizontal scaling**, run:

```bash
npm run start:multi
```

This will start a load balancer on port `4000` and distribute requests to worker processes listening on ports `4001`, `4002`, `4003`, etc., based on the number of available CPU cores.

## API Endpoints

### GET `/api/users`
Returns a list of all users.

**Example:**
```bash
curl http://localhost:4000/api/users
```

### GET `/api/users/:userId`
Returns a specific user by `userId`.

**Example:**
```bash
curl http://localhost:4000/api/users/{id}
```

### POST `/api/users`
Creates a new user. Requires a JSON body with `username`, `age`, and `hobbies`.

**Example:**
```bash
curl -X POST http://localhost:4000/api/users -H "Content-Type: application/json" -d '{"username": "Kate", "age": 20, "hobbies": ["programming", "design"]}'
```

### PUT `/api/users/:userId`
Updates an existing user by `userId`. Requires a JSON body with updated `username`, `age`, or `hobbies`.

**Example:**
```bash
curl -X PUT http://localhost:4000/api/users/{id} -H "Content-Type: application/json" -d '{"username": "Kate Updated", "age": 21}'
```

### DELETE `/api/users/:userId`
Deletes an existing user by `userId`.

**Example:**
```bash
curl -X DELETE http://localhost:4000/api/users/{id}
```

## Data Synchronization

The application uses **Inter-Process Communication (IPC)** to synchronize data between worker processes. When data is updated or created in one worker, the changes are propagated to other workers, ensuring consistent data across all processes.