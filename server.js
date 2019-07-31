const express = require("express");
const userRouter = require("./users/userRouter");
const helmet = require("helmet");

const server = express();

server.use(logger);
server.use(express.json());
server.use("/api/users", userRouter);
server.use(helmet());

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `${req.method} request received, ${req.path} ${new Date().toISOString()}`
  );
  next();
}

module.exports = server;
