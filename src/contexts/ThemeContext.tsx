import { createContext, ReactNode, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  currentTheme: Theme;
  handleToggleTheme: () => void;
};

type ThemeContextProvideProps = {
  children: ReactNode;
};

export const ThemeContext = createContext({} as ThemeContextType);

export function ThemeContextProvider({ children }: ThemeContextProvideProps) {
  const storedTheme = localStorage.getItem("letmeask:theme") as Theme;

  const [currentTheme, setCurrentTheme] = useState<Theme>(
    storedTheme || "light"
  );

  function handleToggleTheme() {
    setCurrentTheme(currentTheme === "light" ? "dark" : "light");
  }

  useEffect(() => {
    localStorage.setItem("letmeask:theme", currentTheme);

    document.body.className = `theme-${currentTheme}`;
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, handleToggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
