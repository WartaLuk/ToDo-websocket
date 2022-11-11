const express = require("express");
const socket = require("socket.io");

const app = express();
const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running...");
});

app.use((req, res) => {
  res.status(404).send({ message: "Not found..." });
});

const io = socket(server);

io.on("connection", (socket) => {
  console.log("Client connected with ID:", socket.id);
  socket.broadcast.emit("updateData", tasks);

  socket.on("addTask", (task) => {
    console.log("Get new task" + task);
    tasks.push(task);
    socket.broadcast.emit("addTask", task);
  });

  socket.on("removeTask", (removeTask) => {
    tasks.splice(tasks.indexOf(removeTask), 1);
    socket.broadcast.emit("removeTask", removeTask);
  });
});
