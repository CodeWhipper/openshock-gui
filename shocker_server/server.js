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

// Beispiel-Daten:
manager.add_collar({ id: 1, name: "Alpha" });
manager.add_collar({ id: 2, name: "Bravo" });

io.on("connection", (socket) => {
  console.log("Client verbunden");

  // Dem Client den aktuellen Zustand schicken
  socket.emit("update", manager.get_all_collars());

  // Client ändert etwas → Server aktualisiert
  socket.on("updateCollar", ({ id, data }) => {
    console.log(id);
    
    manager.update_collar(id, data);
    io.emit("update", manager.get_all_collars());
  });

  // Neuen Collar hinzufügen
  socket.on("addCollar", (collarData) => {
    manager.add_collar(collarData);
    io.emit("update", manager.get_all_collars());
  });
});

server.listen(4000, () => console.log("Server läuft auf Port 4000"));
