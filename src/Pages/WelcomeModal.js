import React, { useEffect } from "react";
import { Dialog, Typography, Button, Box } from "@mui/material";
import "../index.css";

const WelcomeModal = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (open) {
      const timeoutId = setTimeout(() => {
        setOpen(false);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [open, setOpen]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box style={{ margin: "6rem auto" }}>
        <Typography
          variant="h4"
          style={{ marginBottom: "4rem", textAlign: "center" }}
        >
          Welcome to Astronomy Images!
        </Typography>
        <Typography
          variant="body1"
          style={{
            textAlign: "justify",
            margin: "0 2rem",
            paddingBottom: "5rem",
          }}
        >
          Feast your eyes on a daily dose of celestial beauty. Our website
          features NASA's Astronomy Picture of the Day (APOD), showcasing
          stunning photographs of galaxies, nebulae, planets, and more. Each
          image is accompanied by detailed explanations that unravel the science
          and stories behind the stellar scenery. Explore APOD on NASA's
          official website here.
        </Typography>
        <Box style={{ textAlign: "right" }}>
          {/* Apply text-align: right to this Box */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
            style={{ marginRight: "2rem" }}
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default WelcomeModal;
