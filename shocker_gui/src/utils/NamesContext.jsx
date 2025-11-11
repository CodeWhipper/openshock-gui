import { createContext, useContext, useState, useEffect } from "react";
import { get_shockers } from "../Api_calls/Api_calls";

const NamesContext = createContext();

export function NamesProvider({ children }) {
  const [names, setNames] = useState([]);

  // Initial aus API laden
  useEffect(() => {
    const fetchNames = async () => {
      try {
        const shockers = await get_shockers();
        const initialNames = shockers.map((s) => ({
          id: s.id,
          name: s.name,
          active: s.active ?? false,
          max_shock: s.max_shock ?? 50,
          sidebarActive: false,
          game_random: s.game_random ?? false,
          game_wheel: s.game_wheel ?? false,
          game_tick: s.game_tick ?? false,
          game_mine: s.game_mine ?? false,
        }));
        setNames(initialNames);
      } catch (err) {
        console.error("Failed to fetch shockers:", err);
      }
    };
    fetchNames();
  }, []);

  const addName = (newName) => {
    const nextId = names.length > 0 ? Math.max(...names.map(n => n.id)) + 1 : 1;
    setNames([
      ...names,
      {
        id: nextId,
        name: newName,
        active: false,
        sidebarActive: false,
        max_shock: 50,
        game_random: false,
        game_wheel: false,
        game_tick: false,
        game_mine: false,
      },
    ]);
  };

  const updateName = (id, key, value) => {
    setNames((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [key]: value } : n))
    );
  };

  const toggleSidebarActive = (id) => {
    setNames((prev) =>
      prev.map((n) => (n.id === id ? { ...n, sidebarActive: !n.sidebarActive } : n))
    );
  };

  return (
    <NamesContext.Provider
      value={{
        names,
        setNames,
        addName,
        updateName,
        toggleSidebarActive,
      }}
    >
      {children}
    </NamesContext.Provider>
  );
}

export function useNames() {
  return useContext(NamesContext);
}
