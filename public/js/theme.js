// colocated theme script - see /public/js/theme.js for source history
(() => {
  const storageKey = "ol-theme";
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  const label = toggle.querySelector("[data-theme-label]");
  const sunIcon = toggle.querySelector('[data-icon="sun"]');
  const moonIcon = toggle.querySelector('[data-icon="moon"]');
  const applyTheme = (theme) => {
    const normalized = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", normalized);
    if (label) label.textContent = normalized === "dark" ? "Light" : "Dark";
    toggle.setAttribute(
      "aria-label",
      normalized === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
    if (sunIcon && moonIcon) {
      sunIcon.hidden = normalized !== "dark";
      moonIcon.hidden = normalized === "dark";
    }
  };
  const systemPrefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem(storageKey);
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
  applyTheme(initialTheme);
  toggle.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(storageKey, nextTheme);
  });
})();


