const http = require("http");
const express = require("express");

const colyseus = require("colyseus");
const TrainingRoom = require('./training_room');

const PORT = process.env.PORT || 8080;

const app = new express();
const gameServer = new colyseus.Server({
  server: http.createServer(app)
});

// Register ChatRoom as "chat"
gameServer.register("training", TrainingRoom);

app.get("/something", function (req, res) {
  console.log("something!", process.pid);
  res.send("Hey!");
});

// Listen on specified PORT number
gameServer.listen(PORT);

console.log("Running on ws://localhost:" + PORT);
