const express = require("express");
const userRouter = require("./users/userRouter.js");

const server = express();
server.use(express.json());

server.use(logger);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/api/users", userRouter);

//custom middleware
function logger(req, res, next) {
  console.log(
    `Request details-> [Request Type]:${req.method}, [Request URL]:${req.url} `
  );
  next();
}

module.exports = server;
