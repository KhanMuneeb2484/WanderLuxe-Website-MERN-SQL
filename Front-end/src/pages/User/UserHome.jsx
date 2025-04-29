"use client"

import { useEffect } from "react"
import { Button, Card, CardContent, Container, Typography, Grid, Box, Avatar } from "@mui/material"
import {
  LocationOn as MapPinIcon,
  Hotel as HotelIcon,
  Flight as PlaneIcon,
  Person as UserIcon,
  CreditCard as CreditCardIcon,
  Public as GlobeIcon,
  Apartment as BuildingIcon,
  VerifiedUser as UserCheckIcon,
  AccountCircle as UserCircleIcon,
} from "@mui/icons-material"

// Animation classes
const animationClasses = {
  fadeIn: {
    opacity: 0,
    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
  },
  fadeInUp: {
    opacity: 0,
    transform: "translateY(30px)",
    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
  },
  fadeInDown: {
    opacity: 0,
    transform: "translateY(-30px)",
    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
  },
  fadeInLeft: {
    opacity: 0,
    transform: "translateX(-30px)",
    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
  },
  fadeInRight: {
    opacity: 0,
    transform: "translateX(30px)",
    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
  },
  zoomIn: {
    opacity: 0,
    transform: "scale(0.9)",
    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
  },
  visible: {
    opacity: 1,
    transform: "translateY(0) translateX(0) scale(1)",
  },
}

// Custom hook for scroll animations
const useScrollAnimation = () => {
  useEffect(() => {
    const animatedElements = document.querySelectorAll(".animate-on-scroll")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            // Once the animation has played, we can stop observing
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.15, // Trigger when at least 15% of the element is visible
        rootMargin: "0px 0px -50px 0px", // Slightly before the element enters the viewport
      },
    )

    animatedElements.forEach((element) => {
      observer.observe(element)
    })

    return () => {
      animatedElements.forEach((element) => {
        observer.unobserve(element)
      })
    }
  }, [])
}

const UserHome = () => {
  // Use the custom hook
  useScrollAnimation()

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: "120vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: 'url("/assets/img/pexels-pixabay-270756.jpg") no-repeat center center',
          backgroundSize: 'cover',
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.3)" }}></Box>
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10 }}>
          <Box sx={{ maxWidth: "800px", mx: "auto", textAlign: "center" }}>
            <Typography
              variant="h1"
              component="h1"
              className="animate-on-scroll"
              sx={{
                fontWeight: 700,
                color: "white",
                mb: 3,
                fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                ...animationClasses.fadeInDown,
                "&.is-visible": animationClasses.visible,
              }}
            >
              Welcome to Wanderluxe – Your Gateway to Extraordinary Adventures!
            </Typography>
            <Typography
              variant="h5"
              className="animate-on-scroll"
              sx={{
                color: "rgba(255,255,255,0.9)",
                mb: 4,
                fontSize: { xs: "1rem", md: "1.25rem" },
                ...animationClasses.fadeIn,
                "&.is-visible": animationClasses.visible,
                transitionDelay: "0.3s",
              }}
            >
              At Wanderluxe, we believe every journey should be more than just a trip; it should be a story waiting to
              unfold.
            </Typography>
            <Button
              variant="contained"
              className="animate-on-scroll"
              size="large"
              sx={{
                bgcolor: "white",
                color: "#303f9f",
                px: 4,
                py: 1.5,
                borderRadius: "50px",
                fontSize: "1.1rem",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.9)",
                },
                ...animationClasses.fadeInUp,
                "&.is-visible": animationClasses.visible,
                transitionDelay: "0.6s",
              }}
            >
              Explore Packages
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Card
            elevation={6}
            className="animate-on-scroll"
            sx={{
              overflow: "hidden",
              border: "none",
              ...animationClasses.zoomIn,
              "&.is-visible": animationClasses.visible,
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(to right, #3f51b5, #7e57c2)",
                color: "white",
                px: 3,
                py: 5,
              }}
            >
              <Grid container spacing={4}>
                {[
                  { icon: <MapPinIcon fontSize="large" />, title: "50+ Destinations", delay: "0s" },
                  { icon: <CreditCardIcon fontSize="large" />, title: "Best Price Guaranteed", delay: "0.2s" },
                  { icon: <GlobeIcon fontSize="large" />, title: "Eco Friendly Tourism", delay: "0.4s" },
                  { icon: <PlaneIcon fontSize="large" />, title: "Super Fast Booking", delay: "0.6s" },
                ].map((feature, index) => (
                  <Grid item xs={12} md={6} lg={3} key={index}>
                    <Box
                      className="animate-on-scroll"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                        ...animationClasses.fadeInUp,
                        "&.is-visible": animationClasses.visible,
                        transitionDelay: feature.delay,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          width: 60,
                          height: 60,
                          mb: 2,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight="600">
                        {feature.title}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Card>

          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              mb={3}
              color="text.primary"
              className="animate-on-scroll"
              sx={{
                ...animationClasses.fadeInDown,
                "&.is-visible": animationClasses.visible,
              }}
            >
              Pakistan's Leading Tourism Company
            </Typography>
            <Typography
              variant="body1"
              className="animate-on-scroll"
              sx={{
                maxWidth: "1000px",
                mx: "auto",
                fontSize: "1.1rem",
                color: "text.secondary",
                lineHeight: 1.7,
                ...animationClasses.fadeInUp,
                "&.is-visible": animationClasses.visible,
                transitionDelay: "0.2s",
              }}
            >
              Discover breathtaking and amazing Pakistan with one of the best Travel and Tourism Companies in Pakistan.
              We are offering valued touristy plans with complete travel services in affordable{" "}
              <Box
                component="a"
                href="#"
                sx={{ color: "#3f51b5", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
              >
                tour packages
              </Box>{" "}
              from Lahore, Islamabad, and Karachi. Our tour managers and guides organize thrilling and adventurous
              journeys to bring unforgettable holidays to life. So, pack your bags and travel with Pakistan Travel
              Places (PTP) to turn your travel dreams into reality.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 8, bgcolor: "grey.50" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Box
              className="animate-on-scroll"
              sx={{
                display: "inline-block",
                px: 2,
                py: 0.5,
                bgcolor: "#e8eaf6",
                color: "#3f51b5",
                borderRadius: "20px",
                fontSize: "0.875rem",
                fontWeight: 500,
                mb: 2,
                ...animationClasses.fadeInDown,
                "&.is-visible": animationClasses.visible,
              }}
            >
              Services
            </Box>
            <Typography
              variant="h3"
              fontWeight="bold"
              mb={3}
              color="text.primary"
              className="animate-on-scroll"
              sx={{
                ...animationClasses.fadeInUp,
                "&.is-visible": animationClasses.visible,
                transitionDelay: "0.2s",
              }}
            >
              Our Services
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                icon: <MapPinIcon sx={{ fontSize: 35, color: "#3f51b5" }} />,
                title: "City and Country Exploration",
                description:
                  "Users can browse cities within a country, view available hotels, and explore popular travel locations.",
                animation: "fadeInLeft",
                delay: "0s",
              },
              {
                icon: <HotelIcon sx={{ fontSize: 35, color: "#3f51b5" }} />,
                title: "Hotel Selection by City",
                description:
                  "Users can select a city to view available hotels and filter based on preferences like price, amenities, and room types.",
                animation: "fadeInUp",
                delay: "0.1s",
              },
              {
                icon: <PlaneIcon sx={{ fontSize: 35, color: "#3f51b5" }} />,
                title: "Custom Travel Packages",
                description:
                  "Users can create their own travel package by selecting a country, cities, hotels, locations, and an optional tour guide.",
                animation: "fadeInRight",
                delay: "0.2s",
              },
              {
                icon: <UserIcon sx={{ fontSize: 35, color: "#3f51b5" }} />,
                title: "Tour Guide Selection",
                description:
                  "Users can select one guide for the entire trip or opt to proceed without a guide. Guides charge based on service days.",
                animation: "fadeInLeft",
                delay: "0.3s",
              },
              {
                icon: <UserCircleIcon sx={{ fontSize: 35, color: "#3f51b5" }} />,
                title: "User Account Management",
                description: "Travelers can create accounts, store preferences, and manage bookings.",
                animation: "fadeInUp",
                delay: "0.4s",
              },
              {
                icon: <CreditCardIcon sx={{ fontSize: 35, color: "#3f51b5" }} />,
                title: "Payment System",
                description:
                  "Users can book and pay for the entire package, including hotels, locations, and guides, via a secure payment gateway.",
                animation: "fadeInRight",
                delay: "0.5s",
              },
              {
                icon: <GlobeIcon sx={{ fontSize: 35, color: "#3f51b5" }} />,
                title: "Custom Itinerary Management",
                description:
                  "The created package will include a detailed itinerary that users can manage and update if needed.",
                animation: "fadeInUp",
                delay: "0.6s",
              },
            ].map((service, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card
                  elevation={3}
                  className="animate-on-scroll"
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "translateY(-8px)", boxShadow: 8 },
                    borderRadius: 2,
                    ...animationClasses[service.animation],
                    "&.is-visible": animationClasses.visible,
                    transitionDelay: service.delay,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: "#e8eaf6",
                          width: 70,
                          height: 70,
                          mb: 3,
                        }}
                      >
                        {service.icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" align="center" mb={1.5}>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {service.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Booking Process Section */}
      <Box sx={{ py: 8, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Box
              className="animate-on-scroll"
              sx={{
                display: "inline-block",
                px: 2,
                py: 0.5,
                bgcolor: "#e8eaf6",
                color: "#3f51b5",
                borderRadius: "20px",
                fontSize: "0.875rem",
                fontWeight: 500,
                mb: 2,
                ...animationClasses.fadeInDown,
                "&.is-visible": animationClasses.visible,
              }}
            >
              Booking Process
            </Box>
            <Typography
              variant="h3"
              fontWeight="bold"
              color="text.primary"
              className="animate-on-scroll"
              sx={{
                ...animationClasses.fadeInUp,
                "&.is-visible": animationClasses.visible,
                transitionDelay: "0.2s",
              }}
            >
              How to Book Your Dream Trip
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                step: 1,
                icon: <GlobeIcon sx={{ fontSize: 35, color: "#3f51b5" }} />,
                title: "Select Country",
                description: "Begin by selecting the country you want to explore.",
                delay: "0s",
              },
              {
                step: 2,
                icon: <BuildingIcon sx={{ fontSize: 35, color: "#3f51b5" }} />,
                title: "Select City",
                description: "Choose the cities within the selected country to visit.",
                delay: "0.15s",
              },
              {
                step: 3,
                icon: <UserCheckIcon sx={{ fontSize: 35, color: "#3f51b5" }} />,
                title: "Optional Tour Guide",
                description: "Opt to select a tour guide for your trip or proceed without one.",
                delay: "0.3s",
              },
              {
                step: 4,
                icon: <HotelIcon sx={{ fontSize: 35, color: "#3f51b5" }} />,
                title: "Select Hotels and Locations",
                description: "Pick from available hotels and select popular travel locations to visit.",
                delay: "0.45s",
              },
              {
                step: 5,
                icon: <UserCircleIcon sx={{ fontSize: 35, color: "#3f51b5" }} />,
                title: "Create Account",
                description: "Create an account to store preferences and manage your bookings easily.",
                delay: "0.6s",
              },
              {
                step: 6,
                icon: <CreditCardIcon sx={{ fontSize: 35, color: "#3f51b5" }} />,
                title: "Make Payment",
                description: "Book and pay for the entire package, including hotels, locations, and guides.",
                delay: "0.75s",
              },
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box sx={{ position: "relative" }}>
                  <Card
                    elevation={5}
                    className="animate-on-scroll"
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": { boxShadow: 8 },
                      ...animationClasses.fadeInUp,
                      "&.is-visible": animationClasses.visible,
                      transitionDelay: step.delay,
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: -12,
                        left: -12,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: "#3f51b5",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                      }}
                    >
                      {step.step}
                    </Box>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            bgcolor: "#e8eaf6",
                            width: 70,
                            height: 70,
                            mb: 3,
                          }}
                        >
                          {step.icon}
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold" align="center" mb={1.5}>
                          {step.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                          {step.description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default UserHome
