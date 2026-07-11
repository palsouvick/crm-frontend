const THEME_KEY = "theme";

export const getTheme = () => localStorage.getItem(THEME_KEY) || "light";

export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
};

export const toggleTheme = () => {
  const next = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
};
