
import React from "react";
import { 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Avatar
} from "@mui/material";
import {
  LocationOn as MapPinIcon,
  Hotel as HotelIcon,
  Flight as PlaneIcon,
  Person as UserIcon,
  CreditCard as CreditCardIcon,
  Public as GlobeIcon,
  Apartment as BuildingIcon,
  VerifiedUser as UserCheckIcon,
  AccountCircle as UserCircleIcon
} from "@mui/icons-material";

const UserHome = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative', 
          height: '120vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(to right, #303f9f, #7b1fa2, #303f9f)',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.3)' }}></Box>
        <Container maxWidth="lg" sx={{ position: 'relative', zUserHome: 10 }}>
          <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center' }}>
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: 'white', 
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' }
              }}
            >
              Welcome to Wanderluxe – Your Gateway to Extraordinary Adventures!
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                mb: 4,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              At Wanderluxe, we believe every journey should be more than just a trip; 
              it should be a story waiting to unfold.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: '#303f9f', 
                px: 4, 
                py: 1.5, 
                borderRadius: '50px',
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                }
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
          <Card elevation={6} sx={{ overflow: 'hidden', border: 'none' }}>
            <Box sx={{ 
              background: 'linear-gradient(to right, #3f51b5, #7e57c2)', 
              color: 'white', 
              px: 3, 
              py: 5 
            }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6} lg={3}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        width: 60, 
                        height: 60, 
                        mb: 2 
                      }}
                    >
                      <MapPinIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600">50+ Destinations</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6} lg={3}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        width: 60, 
                        height: 60, 
                        mb: 2 
                      }}
                    >
                      <CreditCardIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600">Best Price Guaranteed</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6} lg={3}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        width: 60, 
                        height: 60, 
                        mb: 2 
                      }}
                    >
                      <GlobeIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600">Eco Friendly Tourism</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6} lg={3}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        width: 60, 
                        height: 60, 
                        mb: 2 
                      }}
                    >
                      <PlaneIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600">Super Fast Booking</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Card>

          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" mb={3} color="text.primary">
              Pakistan's Leading Tourism Company
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                maxWidth: '1000px', 
                mx: 'auto', 
                fontSize: '1.1rem',
                color: 'text.secondary',
                lineHeight: 1.7
              }}
            >
              Discover breathtaking and amazing Pakistan with one of the best Travel and Tourism 
              Companies in Pakistan. We are offering valued touristy plans with complete travel 
              services in affordable <Box component="a" href="#" sx={{ color: '#3f51b5', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>tour packages</Box> from 
              Lahore, Islamabad, and Karachi. Our tour managers and guides organize thrilling and 
              adventurous journeys to bring unforgettable holidays to life. So, pack your bags and 
              travel with Pakistan Travel Places (PTP) to turn your travel dreams into reality.
            </Typography>
          </Box>
        </Container>
      </Box>
      
      {/* Services Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box 
              sx={{ 
                display: 'inline-block', 
                px: 2, 
                py: 0.5, 
                bgcolor: '#e8eaf6', 
                color: '#3f51b5', 
                borderRadius: '20px', 
                fontSize: '0.875rem', 
                fontWeight: 500, 
                mb: 2 
              }}
            >
              Services
            </Box>
            <Typography variant="h3" fontWeight="bold" mb={3} color="text.primary">
              Our Services
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {/* Service 1 */}
            <Grid item xs={12} sm={6} lg={3}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  transition: 'all 0.3s ease', 
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 },
                  borderRadius: 2
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#e8eaf6', 
                        width: 70, 
                        height: 70, 
                        mb: 3 
                      }}
                    >
                      <MapPinIcon sx={{ fontSize: 35, color: '#3f51b5' }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" align="center" mb={1.5}>
                      City and Country Exploration
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Users can browse cities within a country, view available hotels, and explore popular travel locations.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Service 2 */}
            <Grid item xs={12} sm={6} lg={3}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  transition: 'all 0.3s ease', 
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 },
                  borderRadius: 2
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#e8eaf6', 
                        width: 70, 
                        height: 70, 
                        mb: 3 
                      }}
                    >
                      <HotelIcon sx={{ fontSize: 35, color: '#3f51b5' }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" align="center" mb={1.5}>
                      Hotel Selection by City
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Users can select a city to view available hotels and filter based on preferences like price, amenities, and room types.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Service 3 */}
            <Grid item xs={12} sm={6} lg={3}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  transition: 'all 0.3s ease', 
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 },
                  borderRadius: 2
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#e8eaf6', 
                        width: 70, 
                        height: 70, 
                        mb: 3 
                      }}
                    >
                      <PlaneIcon sx={{ fontSize: 35, color: '#3f51b5' }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" align="center" mb={1.5}>
                      Custom Travel Packages
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Users can create their own travel package by selecting a country, cities, hotels, locations, and an optional tour guide.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Service 4 */}
            <Grid item xs={12} sm={6} lg={3}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  transition: 'all 0.3s ease', 
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 },
                  borderRadius: 2
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#e8eaf6', 
                        width: 70, 
                        height: 70, 
                        mb: 3 
                      }}
                    >
                      <UserIcon sx={{ fontSize: 35, color: '#3f51b5' }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" align="center" mb={1.5}>
                      Tour Guide Selection
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Users can select one guide for the entire trip or opt to proceed without a guide. Guides charge based on service days.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Service 5 */}
            <Grid item xs={12} sm={6} lg={3}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  transition: 'all 0.3s ease', 
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 },
                  borderRadius: 2
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#e8eaf6', 
                        width: 70, 
                        height: 70, 
                        mb: 3 
                      }}
                    >
                      <UserCircleIcon sx={{ fontSize: 35, color: '#3f51b5' }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" align="center" mb={1.5}>
                      User Account Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Travelers can create accounts, store preferences, and manage bookings.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Service 6 */}
            <Grid item xs={12} sm={6} lg={3}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  transition: 'all 0.3s ease', 
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 },
                  borderRadius: 2
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#e8eaf6', 
                        width: 70, 
                        height: 70, 
                        mb: 3 
                      }}
                    >
                      <CreditCardIcon sx={{ fontSize: 35, color: '#3f51b5' }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" align="center" mb={1.5}>
                      Payment System
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Users can book and pay for the entire package, including hotels, locations, and guides, via a secure payment gateway.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Service 7 */}
            <Grid item xs={12} sm={6} lg={3}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  transition: 'all 0.3s ease', 
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 },
                  borderRadius: 2
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#e8eaf6', 
                        width: 70, 
                        height: 70, 
                        mb: 3 
                      }}
                    >
                      <GlobeIcon sx={{ fontSize: 35, color: '#3f51b5' }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" align="center" mb={1.5}>
                      Custom Itinerary Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      The created package will include a detailed itinerary that users can manage and update if needed.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Booking Process Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box 
              sx={{ 
                display: 'inline-block', 
                px: 2, 
                py: 0.5, 
                bgcolor: '#e8eaf6', 
                color: '#3f51b5', 
                borderRadius: '20px', 
                fontSize: '0.875rem', 
                fontWeight: 500, 
                mb: 2 
              }}
            >
              Booking Process
            </Box>
            <Typography variant="h3" fontWeight="bold" color="text.primary">
              How to Book Your Dream Trip
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {/* Step 1 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative' }}>
                <Card 
                  elevation={5} 
                  sx={{ 
                    height: '100%', 
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: 8 }
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: -12, 
                      left: -12, 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      bgcolor: '#3f51b5', 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}
                  >1</Box>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#e8eaf6', 
                          width: 70, 
                          height: 70, 
                          mb: 3 
                        }}
                      >
                        <GlobeIcon sx={{ fontSize: 35, color: '#3f51b5' }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" align="center" mb={1.5}>
                        Select Country
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Begin by selecting the country you want to explore.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            
            {/* Step 2 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative' }}>
                <Card 
                  elevation={5} 
                  sx={{ 
                    height: '100%', 
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: 8 }
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: -12, 
                      left: -12, 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      bgcolor: '#3f51b5', 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}
                  >2</Box>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#e8eaf6', 
                          width: 70, 
                          height: 70, 
                          mb: 3 
                        }}
                      >
                        <BuildingIcon sx={{ fontSize: 35, color: '#3f51b5' }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" align="center" mb={1.5}>
                        Select City
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Choose the cities within the selected country to visit.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            
            {/* Step 3 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative' }}>
                <Card 
                  elevation={5} 
                  sx={{ 
                    height: '100%', 
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: 8 }
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: -12, 
                      left: -12, 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      bgcolor: '#3f51b5', 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}
                  >3</Box>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#e8eaf6', 
                          width: 70, 
                          height: 70, 
                          mb: 3 
                        }}
                      >
                        <UserCheckIcon sx={{ fontSize: 35, color: '#3f51b5' }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" align="center" mb={1.5}>
                        Optional Tour Guide
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Opt to select a tour guide for your trip or proceed without one.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            
            {/* Step 4 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative' }}>
                <Card 
                  elevation={5} 
                  sx={{ 
                    height: '100%', 
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: 8 }
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: -12, 
                      left: -12, 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      bgcolor: '#3f51b5', 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}
                  >4</Box>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#e8eaf6', 
                          width: 70, 
                          height: 70, 
                          mb: 3 
                        }}
                      >
                        <HotelIcon sx={{ fontSize: 35, color: '#3f51b5' }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" align="center" mb={1.5}>
                        Select Hotels and Locations
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Pick from available hotels and select popular travel locations to visit.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            
            {/* Step 5 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative' }}>
                <Card 
                  elevation={5} 
                  sx={{ 
                    height: '100%', 
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: 8 }
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: -12, 
                      left: -12, 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      bgcolor: '#3f51b5', 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}
                  >5</Box>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#e8eaf6', 
                          width: 70, 
                          height: 70, 
                          mb: 3 
                        }}
                      >
                        <UserCircleIcon sx={{ fontSize: 35, color: '#3f51b5' }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" align="center" mb={1.5}>
                        Create Account
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Create an account to store preferences and manage your bookings easily.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            
            {/* Step 6 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative' }}>
                <Card 
                  elevation={5} 
                  sx={{ 
                    height: '100%', 
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: 8 }
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: -12, 
                      left: -12, 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      bgcolor: '#3f51b5', 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}
                  >6</Box>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#e8eaf6', 
                          width: 70, 
                          height: 70, 
                          mb: 3 
                        }}
                      >
                        <CreditCardIcon sx={{ fontSize: 35, color: '#3f51b5' }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" align="center" mb={1.5}>
                        Make Payment
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Book and pay for the entire package, including hotels, locations, and guides.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default UserHome;
