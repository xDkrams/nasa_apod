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
});

export default darkTheme;
