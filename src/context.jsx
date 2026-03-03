import { createContext, useContext } from "react";

export const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

// Theme helpers — used in App.jsx to init/persist/apply theme without extra re-renders
export const getStoredTheme = () => {
  try { return localStorage.getItem("theme") === "light" ? "light" : "dark"; }
  catch { return "dark"; }
};

export const applyTheme = (t) => {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem("theme", t); } catch {}
};
