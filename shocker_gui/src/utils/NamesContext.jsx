import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "../socket"; 

const NamesContext = createContext();

export function NamesProvider({ children }) {
  const [names, setNames] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Auf Serverdaten warten
    socket.on("update", (serverNames) => {
      setNames(serverNames);
      setInitialized(true);
    });

    return () => socket.off("update");
  }, []);

  // Initiale API nur falls Server noch keine Daten hat
  useEffect(() => {
    if (!initialized) {
      import("../Api_calls/Api_calls").then(({ get_shockers }) => {
        get_shockers().then(shockers => {
          socket.emit("syncCollars", shockers);
        });
      });
    }
  }, [initialized]);

  const updateName = (id, key, value) => {
    setNames(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, [key]: value } : n);
      socket.emit("updateCollar", { id, data: { [key]: value } });
      return updated;
    });
  };

  const addName = (newName) => {
    setNames(prev => {
      const nextId = prev.length > 0 ? Math.max(...prev.map(n => n.id)) + 1 : 1;
      const newCollar = {
        id: nextId,
        name: newName,
        active: false,
        max_shock: 50,
        game_random: false,
        game_wheel: false,
        game_tick: false,
        game_mine: false,
      };
      socket.emit("addCollar", newCollar);
      return [...prev, newCollar];
    });
  };

  return (
    <NamesContext.Provider value={{ names, updateName, addName }}>
      {children}
    </NamesContext.Provider>
  );
}

export function useNames() {
  return useContext(NamesContext);
}
