import React from "react";
import Select from "react-select";

const ThemeDropdown = ({ handleThemeChange, theme }) => {
  const themes = [
    "vs-dark",
    "hc-black",
    "light",
  ];

  const options = themes.map(theme => ({
    value: theme,
    label: theme,
  }));

  const handleChange = (selectedOption) => {
    if (selectedOption) {
      const selectedTheme = selectedOption.value;
      console.log(selectedTheme);
      handleThemeChange(selectedTheme);
    }
  };

  return (
    <Select 
      placeholder="Select Theme"
      defaultValue={options[0]} // Use options[0] as the default value
      options={options} 
      onChange={handleChange}
    />
  );
};

export default ThemeDropdown;
