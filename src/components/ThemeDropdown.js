import React from "react";

const ThemeDropdown = ({ handleThemeChange, theme }) => {
    const themes = [
        "vs",
        "vs-dark",
        "hc-black",
      ];

  const handleChange = (event) => {
    const selectedTheme = event.target.value;
    console.log(selectedTheme);
    handleThemeChange(selectedTheme);
  };

  return (
    <div>
      <label htmlFor="theme-select">Select Theme:</label>
      <select id="theme-select" value={theme}  onChange={handleChange}>
        {themes.map((themeOption) => (
          <option key={themeOption} value={themeOption}>
            {themeOption}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeDropdown;
