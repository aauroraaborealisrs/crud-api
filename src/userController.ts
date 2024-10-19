import { IncomingMessage, ServerResponse } from "http";
import { v4 as uuidv4, validate as isUuidValid } from "uuid";

type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

let users: User[] = [];

const handleServerError = (res: ServerResponse, error: unknown) => {
  console.error("Internal Server Error:", error);
  res.writeHead(500, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: "Internal Server Error. Please try again later.",
    }),
  );
};

const validateUuid = (id: string, res: ServerResponse): boolean => {
  if (!isUuidValid(id)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid userId format" }));
    return false;
  }
  return true;
};

const validateUserData = (data: {
  username?: string;
  age?: number;
  hobbies?: string[];
}) => {
  const missingFields = [];
  if (!data.username) missingFields.push("username");
  if (!data.age) missingFields.push("age");
  if (!Array.isArray(data.hobbies)) missingFields.push("hobbies");

  return missingFields.length > 0
    ? `Invalid data: body does not contain required fields (${missingFields.join(", ")})`
    : null;
};

export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
  try {
    //throw new Error('Test server error');
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (error) {
    handleServerError(res, error);
  }
};

export const getUserById = (
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
) => {
  try {
    if (!validateUuid(id, res)) return;

    const user = users.find((u) => u.id === id);

    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

export const createUser = (req: IncomingMessage, res: ServerResponse) => {
  try {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const data = JSON.parse(body);

      const validationError = validateUserData(data);
      if (validationError) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: validationError }));
        return;
      }

      const newUser: User = {
        id: uuidv4(),
        username: data.username,
        age: data.age,
        hobbies: data.hobbies,
      };

      users.push(newUser);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newUser));
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

export const updateUser = (
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
) => {
  try {
    if (!validateUuid(id, res)) return;

    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const data = JSON.parse(body);
      const userIndex = users.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User not found" }));
        return;
      }

      const validationError = validateUserData(data);
      if (validationError) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: validationError }));
        return;
      }

      users[userIndex] = {
        id,
        username: data.username,
        age: data.age,
        hobbies: data.hobbies,
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users[userIndex]));
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

export const deleteUser = (
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
) => {
  try {
    if (!validateUuid(id, res)) return;

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found" }));
    } else {
      users.splice(userIndex, 1);
      res.writeHead(204);
      res.end();
    }
  } catch (error) {
    handleServerError(res, error);
  }
};
