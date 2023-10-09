import React, { useState, useEffect } from "react";
import "../index.css";
import axios from "axios";

// MUI components
import { Box, Paper, Typography, IconButton, Collapse } from "@mui/material";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/en";

const Astronomy = () => {
  // API key
  const key = "YjVAcfbB9h2bx2hb3OcLG63oR6eaf6rjrWQf60ec";
  const initialDate = "2015-01-01";

  // States
  const [formattedDate, setFormattedDate] = useState(initialDate);
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [isErr, setIsErr] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [imgDetails, setImgDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs(initialDate));

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Format the selected date as a string
    const formattedSelectedDate = date.format("YYYY-MM-DD");
    setFormattedDate(formattedSelectedDate);
  };

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
    setLoading(true);
    axios
      .get(
        `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${formattedDate}`
      )
      .then((response) => {
        if (response.status === 200) {
          const apodData = response.data;
          setImgDetails(apodData);

          if (apodData.url) {
            const img = new Image();
            img.src = apodData.url;

            img.onload = () => {
              setImages([apodData.url]);
            };

            img.onerror = () => {
              setOpen(true);
              setIsErr(true);
              setAlertMsg(`Error loading image`);
              setImages([]); // Set images as an empty array or provide a fallback image URL
            };
          }

          const updateDatePickerValue = dayjs(formattedDate);
          setSelectedDate(updateDatePickerValue);
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
      const timeoutId = setTimeout(() => {
        setOpen(false);
        setAlertMsg(null);
        setIsErr(false);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    } else {
      fetchNextImage();
    }
  };

  const fetchNextImage = () => {
    const currentDate = new Date(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const newFormattedDate = `${year}-${month}-${day}`;
    setFormattedDate(newFormattedDate);
  };

  const handlePrevious = () => {
    setLoading(true);
    const currentDate = new Date(formattedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const newFormattedDate = `${year}-${month}-${day}`;
    setFormattedDate(newFormattedDate);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <>
      <Box>
        <div className="starry-background" id="starry-bg"></div>
        <Box style={{ height: "5vh" }}>
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
          <Box style={{ padding: "1rem 0" }}>
            <Typography
              variant="h4"
              align="center"
              className="text-elements"
              style={{ fontFamily: "SpaceMono" }}
            >
              {imgDetails?.title}
            </Typography>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "white",
                margin: "0 15rem",
                marginBottom: "0.1rem",
                borderRadius: "2rem",
              }}
            >
              {/* Centered DatePicker */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  sx={{
                    "& fieldset": {
                      border: "none",
                    },
                    "& input": {
                      color: "black",
                      textAlign: "center", // Center-align the text
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>
          </Box>
          <Box
            style={{
              textAlign: "center",
              margin: "1rem 10rem",
              maxHeight: "13rem",
              height: "13rem",
              overflow: "auto",
            }}
          >
            <Typography
              className="text-elements"
              style={{
                fontFamily: "SpaceMono",
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
              rel="noopener noreferrer"
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
