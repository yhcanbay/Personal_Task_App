export const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'system') {
    root.removeAttribute('data-theme');
    return;
  }
  root.setAttribute('data-theme', theme);
};

