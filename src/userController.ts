import { IncomingMessage, ServerResponse } from "http";
import { v4 as uuidv4, validate as isUuidValid } from "uuid";

type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

let users: User[] = [];

const validateUuid = (id: string, res: ServerResponse): boolean => {
  if (!isUuidValid(id)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid userId format" }));
    return false;
  }
  return true;
};

export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(users));
};

export const getUserById = (
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
) => {
  if (!validateUuid(id, res)) return;

  const user = users.find((u) => u.id === id);

  if (!user) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User not found" }));
  } else {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  }
};

export const createUser = (req: IncomingMessage, res: ServerResponse) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { username, age, hobbies } = JSON.parse(body);

    if (!username || !age || !Array.isArray(hobbies)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Invalid data: body does not contain required fields",
        }),
      );
      return;
    }

    const newUser: User = {
      id: uuidv4(),
      username,
      age,
      hobbies,
    };

    users.push(newUser);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newUser));
  });
};

export const updateUser = (
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
) => {
  if (!validateUuid(id, res)) return;

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { username, age, hobbies } = JSON.parse(body);
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found" }));
      return;
    }

    if (!username || !age || !Array.isArray(hobbies)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid data" }));
      return;
    }

    users[userIndex] = { id, username, age, hobbies };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users[userIndex]));
  });
};

export const deleteUser = (
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
) => {
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
};
