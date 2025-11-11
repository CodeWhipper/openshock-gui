const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const CollarManager = require("./Collar_Manager");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const manager = new CollarManager();

io.on("connection", (socket) => {
  console.log("Client verbunden");

  // Aktuellen Zustand senden
  socket.emit("update", manager.get_all_collars());

  // Client ändert etwas → Server aktualisiert und broadcast
  socket.on("updateCollar", ({ id, data }) => {
    manager.update_collar(id, data);
    io.emit("update", manager.get_all_collars());
  });

  // Sync komplett vom Client → Upsert
  socket.on("syncCollars", (collars) => {
    collars.forEach(c => manager.upsertCollar(c));
    io.emit("update", manager.get_all_collars());
  });

  // Neuen Collar hinzufügen
  socket.on("addCollar", (collarData) => {
    manager.add_collar(collarData);
    io.emit("update", manager.get_all_collars());
  });
});

server.listen(4000, () => console.log("Server läuft auf Port 4000"));
