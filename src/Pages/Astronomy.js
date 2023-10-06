import React, { useState, useEffect } from "react";
import "../index.css";
import axios from "axios";

//mui components
import { Box, Paper, Button, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const Astronomy = () => {
  // apiKey
  const key = "YjVAcfbB9h2bx2hb3OcLG63oR6eaf6rjrWQf60ec";
  const initialDate = "2015-01-01";
  const [formattedDate, setFormattedDate] = useState(initialDate);

  // states handling other components
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [isErr, setIsErr] = useState(false);

  // States for handling changing images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // State for image URLs
  const [images, setImages] = useState([]);
  const [imgDetails, setImgDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const numStars = 200;
    const starryBackground = document.getElementById("starry-bg");

    for (let i = 0; i < numStars; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      starryBackground.appendChild(star);
    }
  }, []);

  useEffect(() => {
    // Fetch initial set of image URLs
    axios
      .get(
        `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${formattedDate}`
      )
      .then((response) => {
        if (response.status === 200) {
          const apodData = response.data;
          // Set other APOD details as needed
          setImgDetails(apodData);

          // Check if the URL exists
          if (apodData.url) {
            // Attempt to load the image
            const img = new Image();
            img.src = apodData.url;

            img.onload = () => {
              // Image loaded successfully
              setImages([apodData.url]);
            };

            img.onerror = () => {
              // Handle errors when loading the image
              setOpen(true);
              setIsErr(true);
              setAlertMsg(`Error loading image`);
              setImages([]); // Set images as an empty array or provide a fallback image URL
            };
          }
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      })
      .catch((error) => {
        console.log(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setAlertMsg(error.response.data.message);
        } else {
          setAlertMsg("An error occurred while fetching data.");
        }
        setOpen(true);
        setIsErr(true);
        console.error("Error fetching data:", error);
      });
  }, [formattedDate]);

  useEffect(() => {
    if (open) {
      // If the 'open' state is true, set a timeout to close it after 5 seconds
      const timeoutId = setTimeout(() => {
        setOpen(false);
        setAlertMsg(null);
        setIsErr(false);
      }, 5000);

      // Clean up the timeout when the component unmounts or when 'open' changes
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  const handleNext = () => {
    setLoading(true);
    if (currentImageIndex < images.length - 1) {
      // If there are more images in the array, increment the index
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    } else {
      // If there are no more images in the array, fetch the next image
      fetchNextImage();
    }
  };

  const fetchNextImage = () => {
    // Convert the current formattedDate to a Date object
    const currentDate = new Date(formattedDate);

    // Increment the date by one day
    currentDate.setDate(currentDate.getDate() + 1);

    // Convert the updated date back to the "yyyy-mm-dd" format
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const newFormattedDate = `${year}-${month}-${day}`;

    // Update the formattedDate state with the new date
    setFormattedDate(newFormattedDate);
  };

  const handlePrevious = () => {
    setLoading(true);
    // Convert the current formattedDate to a Date object
    const currentDate = new Date(formattedDate);

    // Decrement the date by one day
    currentDate.setDate(currentDate.getDate() - 1);

    // Convert the updated date back to the "yyyy-mm-dd" format
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const newFormattedDate = `${year}-${month}-${day}`;

    // Update the formattedDate state with the new date
    setFormattedDate(newFormattedDate);
  };

  useEffect(() => {
    // Simulate a 1.5-second loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, [loading]);
  return (
    <>
      <Box>
        <div className="starry-background" id="starry-bg"></div>
        <Box style={{ height: "5vh" }}>
          {/* Display an alert message */}
          <Collapse in={open}>
            <Alert
              severity={isErr ? "error" : "success"}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              {alertMsg}
            </Alert>
          </Collapse>
        </Box>
        {loading && (
          <>
            <Box className="loading-animation">
              <Box className="loading-spinner"> </Box>
            </Box>
          </>
        )}
        {/* <Typography variant="h6">Astronomy</Typography> */}
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            overflowX: "hidden",
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 1rem",
              width: "100%",
            }}
          >
            <IconButton
              onClick={handlePrevious}
              color="primary"
              sx={{
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <KeyboardArrowLeftIcon
                fontSize="large"
                style={{ fontSize: "7rem", marginLeft: "8rem" }}
              />
            </IconButton>
            <Paper
              elevation={24}
              style={{
                padding: "4rem",
                margin: "0 auto",
                width: "45%",
                height: "40vh",
                backgroundImage: `url('${images[0]}')`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                flex: "1 1 auto",
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
              }}
            >
              <Box
                style={{
                  margin: "0 auto",
                  width: "41%",
                  height: "95%",
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                }}
              >
                <img
                  className="zoom-background"
                  src={images[0]}
                  alt="APOD"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    border: "1px",
                  }}
                />
              </Box>
            </Paper>
            <IconButton
              onClick={handleNext}
              color="primary"
              sx={{
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <KeyboardArrowRightIcon
                fontSize="large"
                style={{ fontSize: "7rem", marginRight: "8rem" }}
              />
            </IconButton>
          </Box>
          <Box style={{ paddingTop: "2rem" }}>
            {/* Display image details */}
            <Typography variant="h4" align="center" className="text-elements">
              {imgDetails?.title}
            </Typography>
            <Typography variant="h6" align="center" className="text-elements">
              {imgDetails?.date}
            </Typography>
          </Box>
          <Box
            style={{
              textAlign: "center",
              margin: "2rem 10rem",
              maxHeight: "16rem",
              height: "16rem",
              overflow: "auto",
            }}
          >
            <Typography
              className="text-elements"
              style={{
                marginLeft: "8rem",
                marginRight: "8rem",
                textAlign: "justify",
                fontSize: "1.3rem",
              }}
            >
              {imgDetails?.explanation}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="body2" className="text-elements">
            Image credits: NASA's Astronomy Picture of the Day (APOD) - Explore
            more at{" "}
            <a
              className="text-elements"
              href="https://apod.nasa.gov/apod/astropix.html"
              target="_blank"
              rel="noopener nreferrer"
            >
              {" "}
              https://apod.nasa.gov/apod/astropix.html
            </a>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Astronomy;
