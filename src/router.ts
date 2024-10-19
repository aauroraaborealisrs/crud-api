import { IncomingMessage, ServerResponse } from "http";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./userController";

export const router = (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;

  if (!url?.startsWith("/api")) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "API route not found" }));
    return;
  }

  const apiUrl = url.replace("/api", "");

  if (method === "GET" && apiUrl === "/users") {
    getUsers(req, res);
  } else if (method === "POST" && apiUrl === "/users") {
    createUser(req, res);
  } else if (method === "GET" && apiUrl.startsWith("/users/")) {
    const id = apiUrl.split("/")[2];
    getUserById(req, res, id);
  } else if (method === "PUT" && apiUrl.startsWith("/users/")) {
    const id = apiUrl.split("/")[2];
    updateUser(req, res, id);
  } else if (method === "DELETE" && apiUrl.startsWith("/users/")) {
    const id = apiUrl.split("/")[2];
    deleteUser(req, res, id);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
};
