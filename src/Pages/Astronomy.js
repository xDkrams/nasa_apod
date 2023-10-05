import React, { useState, useEffect } from "react";
import "../index.css";
import axios from "axios";

//mui components
import { Box, Paper, Button, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

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

  useEffect(() => {
    // Fetch initial set of image URLs
    axios
      .get(
        `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${formattedDate}`
      )
      .then((response) => {
        if (response.status === 200) {
          const apodData = response.data;
          console.log(apodData);
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

  return (
    <>
      <Box>
        <Box>
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
        {/* <Typography variant="h6">Astronomy</Typography> */}
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
          }}
        >
          <Paper
            elevation={24}
            className="zoom-background"
            style={{
              margin: "0 auto",
              width: "100%",
              height: "100%",
              border: ".3rem solid gray",
            }}
          >
            <img
              src={images[0]}
              alt="APOD"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                margin: "0 auto",
                border: "1px",
              }}
            />
          </Paper>
        </Paper>
        <Box>
          {/* Navigation buttons */}
          <div
            style={{
              textAlign: "center",
              paddingBottom: "1rem",
              paddingTop: "2rem",
            }}
          >
            <Button variant="outlined" onClick={handlePrevious}>
              Previous
            </Button>
            <Button variant="outlined" onClick={handleNext}>
              Next
            </Button>
          </div>
          {/* Display image details */}
          <Typography variant="h5" align="center">
            {imgDetails?.title}
          </Typography>
          <Typography variant="h6" align="center">
            {imgDetails?.date}
          </Typography>
        </Box>
        <Box
          style={{
            textAlign: "center",
            margin: "0 10rem",
            // paddingTop: "3rem",
            // paddingBottom: "3rem",
            // border: "solid .3rem black",
            borderRadius: "30rem",
          }}
        >
          <p
            style={{
              marginLeft: "8rem",
              marginRight: "8rem",
              textAlign: "justify",
              fontSize: "1.4rem",
            }}
          >
            {imgDetails?.explanation}
          </p>
        </Box>
      </Box>
    </>
  );
};

export default Astronomy;
