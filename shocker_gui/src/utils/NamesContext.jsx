import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "../socket"; 

// Create context for names
const NamesContext = createContext();

export function NamesProvider({ children }) {
  const [names, setNames] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Listen for server updates
  useEffect(() => {
    const handleUpdate = (serverNames) => {
      setNames(serverNames);
      setInitialized(true);
    };

    socket.on("update", handleUpdate);
    return () => socket.off("update", handleUpdate);
  }, []);

  // Fetch initial names from API if server has none
  useEffect(() => {
    if (!initialized) {
      import("../Api_calls/Api_calls").then(({ get_shockers }) => {
        get_shockers().then(shockers => {
          socket.emit("syncCollars", shockers);
        });
      });
    }
  }, [initialized]);

  // Update a name's property
  const updateName = (id, key, value) => {
    setNames(prevNames => {
      const updatedNames = prevNames.map(n => 
        n.id === id ? { ...n, [key]: value } : n
      );
      socket.emit("updateCollar", { id, data: { [key]: value } });
      return updatedNames;
    });
  };

  // Add a new name
  const addName = (newName) => {
    setNames(prevNames => {
      const nextId = prevNames.length ? Math.max(...prevNames.map(n => n.id)) + 1 : 1;
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
      return [...prevNames, newCollar];
    });
  };

  return (
    <NamesContext.Provider value={{ names, updateName, addName }}>
      {children}
    </NamesContext.Provider>
  );
}

// Custom hook to access names context
export function useNames() {
  return useContext(NamesContext);
}
