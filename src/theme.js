// Import necessary modules
import { createTheme } from "@mui/material/styles";

// Create a custom theme with dark mode colors
const darkTheme = createTheme({
  palette: {
    type: "dark", // Use dark mode
    primary: {
      main: "#1e88e5", // Adjust primary color
    },
    icon: {
      main: "white", // Set the icon color to white or your preferred color
    },
  },
  breakpoints: {
    values: {
      xs: 0, // Extra small screens (0 - 599px)
      sm: 600, // Small screens (600 - 959px)
      md: 960, // Medium screens (960 - 1279px)
      lg: 1280, // Large screens (1280 - 1919px)
      xl: 1920, // Extra large screens (1920px and up)
    },
  },
});

export default darkTheme;
