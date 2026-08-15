import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState("system");
  const [resolvedTheme, setResolvedTheme] = useState("light");

  const applyTheme = useCallback((theme) => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      root.classList.add("dark");
    } else {
      root.removeAttribute("data-theme");
      root.classList.remove("dark");
    }
  }, []);

  const getSystemTheme = useCallback(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

  const resolveTheme = useCallback(
    (theme) => {
      if (theme === "system") {
        return getSystemTheme();
      }
      return theme;
    },
    [getSystemTheme],
  );

  const handleThemeChange = useCallback(
    (newTheme) => {
      setSelectedTheme(newTheme);
      const resolved = resolveTheme(newTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved);
      try {
        localStorage.setItem("scholaros_theme", newTheme);
      } catch {}
    },
    [resolveTheme, applyTheme],
  );

  useEffect(() => {
    let saved;
    try {
      saved = localStorage.getItem("scholaros_theme");
    } catch {}
    const initialTheme = saved || "system";
    setSelectedTheme(initialTheme);
    const initialResolved = resolveTheme(initialTheme);
    setResolvedTheme(initialResolved);
    applyTheme(initialResolved);
  }, [resolveTheme, applyTheme]);

  useEffect(() => {
    if (selectedTheme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      const newResolved = e.matches ? "dark" : "light";
      setResolvedTheme(newResolved);
      applyTheme(newResolved);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [selectedTheme, applyTheme]);

  const value = {
    selectedTheme,
    resolvedTheme,
    setTheme: handleThemeChange,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
