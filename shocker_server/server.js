const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const CollarManager = require("./Collar_Manager");

// Check for --testing flag
const isTestingMode = process.argv.includes("--testing") || process.argv.includes("--test");

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

  socket.on("clearcollars",() => {
    manager.clearCollarlist();
    io.emit("update", manager.get_all_collars());
  })

  // Neuen Collar hinzufügen
  socket.on("addCollar", (collarData) => {
    if (isTestingMode) {
      console.log(`🧪 [TEST MODE] Add collar request:`, collarData);
    }
    manager.add_collar(collarData);
    io.emit("update", manager.get_all_collars());
  });

  // Handle collar control actions (shock, vibrate, sound) from GUI in testing mode
  socket.on("collarControl", ({ collarId, type, intensity, duration }) => {
    if (isTestingMode) {
      const collar = manager.collarlist.find(c => c.get_id() === collarId);
      const collarName = collar ? collar.get_name() : collarId;
      console.log(`🧪 [TEST MODE] Collar Control - "${collarName}" (${collarId}): ${type} - Intensity: ${intensity}, Duration: ${duration}ms`);
    }
  });
});

const port = 4000;
server.listen(port, () => {
  if (isTestingMode) {
    console.log(`🧪 Server läuft auf Port ${port} (TESTING MODE)`);
  } else {
    console.log(`Server läuft auf Port ${port}`);
  }
});
