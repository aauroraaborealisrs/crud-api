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

  switch (method) {
    case "GET":
      if (apiUrl === "/users") {
        getUsers(req, res);
      } else if (apiUrl.startsWith("/users/")) {
        const id = apiUrl.split("/")[2];
        getUserById(req, res, id);
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
      }
      break;

    case "POST":
      if (apiUrl === "/users") {
        createUser(req, res);
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
      }
      break;

    case "PUT":
      if (apiUrl.startsWith("/users/")) {
        const id = apiUrl.split("/")[2];
        updateUser(req, res, id);
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
      }
      break;

    case "DELETE":
      if (apiUrl.startsWith("/users/")) {
        const id = apiUrl.split("/")[2];
        deleteUser(req, res, id);
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
      }
      break;

    default:
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Method not allowed" }));
      break;
  }
};
