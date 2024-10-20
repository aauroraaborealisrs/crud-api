# SIMPLE CRUD API

This project is a simple CRUD API built using **Node.js** and **Cluster API** for horizontal scaling. The application supports creating, programming, updating, and deleting users with an in-memory database. The API horizontally scales across multiple CPU cores, distributing requests using a Round-robin algorithm.

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

### API Endpoints for Postman

#### 1. **GET `/api/users`**
**Description**: Retrieve a list of all users.

**Postman Setup**:
- **Method**: GET
- **URL**: `http://localhost:4000/api/users`
  
**Expected Response (Example)**:
```json
[
  {
    "id": "37261ced-272e-42bb-8fc0-2c43620f03d2",
    "username": "Kate",
    "age": 20,
    "hobbies": ["programming", "design"]
  },
  {
    "id": "37261ced-272e-42bb-8fc0-2c43620f03d4",
    "username": "Daria",
    "age": 21,
    "hobbies": ["hiking", "gaming"]
  }
]
```

#### 2. **GET `/api/users/:userId`**
**Description**: Retrieve a specific user by `userId`.

**Postman Setup**:
- **Method**: GET
- **URL**: `http://localhost:4000/api/users/<userId>` (replace `<userId>` with a valid ID)

**Example**:
- **URL**: `http://localhost:4000/api/users/37261ced-272e-42bb-8fc0-2c43620f03d2`

**Expected Response (Example)**:
```json
{
  "id": "37261ced-272e-42bb-8fc0-2c43620f03d2",
  "username": "Kate",
  "age": 30,
  "hobbies": ["programming", "design"]
}
```

#### 3. **POST `/api/users`**
**Description**: Create a new user. Requires a JSON body with `username`, `age`, and `hobbies`.

**Postman Setup**:
- **Method**: POST
- **URL**: `http://localhost:4000/api/users`
- **Body**: Select **raw** and **JSON**

**Request Body Example**:
```json
{
  "username": "Alice Wonderland",
  "age": 28,
  "hobbies": ["adventure", "chess"]
}
```

**Expected Response (Example)**:
```json
{
  "id": "37261ced-272e-42bb-8fc0-2c43620f03d5",
  "username": "Alice Wonderland",
  "age": 28,
  "hobbies": ["adventure", "chess"]
}
```

#### 4. **PUT `/api/users/:userId`**
**Description**: Update an existing user by `userId`. Requires a JSON body with the fields you want to update.

**Postman Setup**:
- **Method**: PUT
- **URL**: `http://localhost:4000/api/users/<userId>` (replace `<userId>` with a valid ID)
- **Body**: Select **raw** and **JSON**

**Example**:
- **URL**: `http://localhost:4000/api/users/37261ced-272e-42bb-8fc0-2c43620f03d2`

**Request Body Example**:
```json
{
  "username": "Kate Updated",
  "age": 20,
  "hobbies": ["programming", "running"]
}
```

**Expected Response (Example)**:
```json
{
  "id": "37261ced-272e-42bb-8fc0-2c43620f03d2",
  "username": "Kate Updated",
  "age": 20,
  "hobbies": ["programming", "running"]
}
```

#### 5. **DELETE `/api/users/:userId`**
**Description**: Delete a user by `userId`.

**Postman Setup**:
- **Method**: DELETE
- **URL**: `http://localhost:4000/api/users/<userId>` (replace `<userId>` with a valid ID)

**Example**:
- **URL**: `http://localhost:4000/api/users/37261ced-272e-42bb-8fc0-2c43620f03d2`

**Expected Response**:
- **Status**: 204 No Content (no response body)

---

### How to save these requests in Postman:
1. **Create a new Collection** in Postman.
2. Add each of the above requests to the collection.
3. For each request, specify the correct method, URL, and body (if required).
4. You can now send the requests and verify the responses!

This will give you a complete set of Postman examples for interacting with your API!