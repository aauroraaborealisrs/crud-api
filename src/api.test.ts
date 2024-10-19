import request from "supertest";
import { createServer } from "http";
import { router } from "./router";

let server: any;

beforeAll(() => {
  server = createServer(router);
});

afterAll(() => {
  server.close();
});

describe("API Tests", () => {
  let userId: string;

  it("should return an empty array when getting all users", async () => {
    const res = await request(server).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should create a new user", async () => {
    const newUser = { username: "Kate", age: 20, hobbies: ["learn in rs"] };
    const res = await request(server).post("/api/users").send(newUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toMatchObject(newUser);
    userId = res.body.id;
  });

  it("should get the created user by id", async () => {
    const res = await request(server).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", userId);
    expect(res.body).toMatchObject({
      username: "Kate",
      age: 20,
      hobbies: ["learn in rs"],
    });
  });

  it("should update the created user by id", async () => {
    const updatedUser = { username: "Not Kate", age: 21, hobbies: ["testing"] };
    const res = await request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", userId);
    expect(res.body).toMatchObject(updatedUser);
  });

  it("should delete the created user by id", async () => {
    const res = await request(server).delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(204);
  });

  it("should return 404 when trying to get a deleted user", async () => {
    const res = await request(server).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(404);
  });
});
