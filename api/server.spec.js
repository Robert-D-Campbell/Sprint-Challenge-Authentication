const request = require("supertest");
const Users = require("../users/usersModel");
const db = require("../database/dbConfig.js");
const server = require("./server.js");

describe("server.js", function() {
  describe("environment", function() {
    it("should set environment to testing", function() {
      expect(process.env.DB_ENV).toBe("testing");
    });
  });

  describe("GET /", function() {
    it("should return a 200 OK", function() {
      // spin up the server
      return request(server)
        .get("/")
        .then(res => {
          expect(res.status).toBe(200);
        });
      // make GET request to /
      // look at the http status code for the response
    });

    it("should return a JSON", function() {
      return request(server)
        .get("/")
        .then(res => {
          expect(res.type).toMatch(/json/i);
        });
    });

    it("should return {api: 'up and running'}", function() {
      return request(server)
        .get("/")
        .then(res => {
          expect(res.body.api).toBe("up and running");
        });
    });
  });
  /////register and login///////
  it("should register a user ", function() {
    return request(server)
      .post("/api/auth/register")
      .send({ username: "test5", password: "test" })
      .then(res => {
        expect(res.status).toBe(201);
      });
  });
  it("responds with json", function(done) {
    request(server)
      .post("/api/auth/register")
      .send({ username: "john", password: "test" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it("should authorize the user", function() {
    return request(server)
      .post("/api/auth/login")
      .send({ username: "test4", password: "test" })
      .then(res => {
        console.log(res.body.token);
        const token = res.body.token;
        return request(server)
          .get("/api/jokes")
          .set("Authorization", token)
          .then(res => {
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
          });
      });
  });
  it("responds with json", function(done) {
    request(server)
      .post("/api/auth/login")
      .send({ username: "test4", password: "test" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  /////register and login///////
  //////adding users////
  describe("users model", function() {
    beforeEach(async () => {
      await db("users").truncate();
    });

    describe("add()", function() {
      it("should add the user to the database", async function() {
        await Users.add({ username: "test1", password: "test" });
        const users = await db("users");
        expect(users).toHaveLength(1);
      });
      it("should add two different users to the database", async function() {
        await Users.add({ username: "test2", password: "test" });
        await Users.add({ username: "test3", password: "test" });

        const multiUsers = await db("users");
        expect(multiUsers).toHaveLength(2);
        expect(multiUsers[1].username).toBe("test3");
      });
    });
  });
  //////adding users////
});
