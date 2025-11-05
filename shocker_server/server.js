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

// Initialize dummy collars in testing mode
if (isTestingMode) {
  console.log("🧪 TESTING MODE ENABLED - Using dummy collars");
  manager.add_collar({ id: "test-collar-1", name: "Test Collar 1" });
  manager.add_collar({ id: "test-collar-2", name: "Test Collar 2" });
  manager.add_collar({ id: "test-collar-3", name: "Test Collar 3" });
  console.log("✅ Initialized 3 dummy collars");
}

io.on("connection", (socket) => {
  console.log("Client verbunden");

  // Notify client about testing mode
  socket.emit("testingMode", isTestingMode);

  // Dem Client den aktuellen Zustand schicken
  socket.emit("update", manager.get_all_collars());

  // Client ändert etwas → Server aktualisiert
  socket.on("updateCollar", ({ id, data }) => {
    const collar = manager.collarlist.find(c => c.get_id() === id);
    const collarName = collar ? collar.get_name() : id;
    
    if (isTestingMode) {
      console.log(`🧪 [TEST MODE] Collar "${collarName}" (${id}) updated:`, data);
    } else {
      console.log(`Collar "${collarName}" (${id}) updated:`, data);
    }
    
    manager.update_collar(id, data);
    io.emit("update", manager.get_all_collars());
  });

  socket.on("syncCollars", (collars) => {
    if (isTestingMode) {
      console.log("🧪 [TEST MODE] Sync collars request (ignoring in test mode)");
      // Don't sync in testing mode, keep dummy collars
    } else {
      collars.forEach(c => manager.upsertCollar(c));
    }
    
    io.emit("update", manager.get_all_collars());
  });

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
