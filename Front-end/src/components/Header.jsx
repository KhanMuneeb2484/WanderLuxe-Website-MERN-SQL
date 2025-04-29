
import React, { useState, useEffect,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Menu,
  MenuItem,
  Divider,
  useScrollTrigger,
  Slide,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// Mock AuthContext since it's not available in the provided files

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errorMessage, setErrorMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // ✅ safer default for DOM elements
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const isScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const handleRegisterOpen = () => setRegisterOpen(true);
  const handleRegisterClose = () => {
    setRegisterOpen(false);
    setErrorMessage("");
  };

  const handleLoginRedirect = () => {
    handleRegisterClose();
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/users/register-user", {
        ...formData,
        password_hash: formData.password,
        role: "user",
      });
      
      if (response.data) {
        setRegisterOpen(false);
        navigate("/login");
      } else {
        setErrorMessage(response.data.message || "Registration failed.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          sx={{
            zIndex: 1, // Lower z-index so the Hero section can overlap

            
            backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.9)' : 'rgba(33, 37, 41, 0.85)',
            transition: 'background-color 0.3s ease',
            boxShadow: isScrolled ? 3 : 0,
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              {/* Logo */}
              <Box sx={{ display: 'flex', flexGrow: { xs: 1, md: 0 }, mr: 2 }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  <img
                    src="/assets/img/LOGO1.png"
                    alt="Wander Luxe Logo"
                    style={{ height: "80px" }}
                  />
                </Link>
              </Box>

              {/* Mobile menu button */}
              {isMobile && (
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMobileMenuToggle}
                  sx={{ ml: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              {/* Desktop Navigation Links */}
              {!isMobile && (
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/About"
                    sx={{ mx: 1, fontSize: '1rem', textTransform: 'none' }}
                  >
                    About
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/Packages"
                    sx={{ mx: 1, fontSize: '1rem', textTransform: 'none' }}
                  >
                    Packages
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/Destination"
                    sx={{ mx: 1, fontSize: '1rem', textTransform: 'none' }}
                  >
                    Destination
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/Booking"
                    sx={{ mx: 1, fontSize: '1rem', textTransform: 'none' }}
                  >
                    Booking
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/Contact"
                    sx={{ mx: 1, fontSize: '1rem', textTransform: 'none' }}
                  >
                    Contact
                  </Button>
                </Box>
              )}

              {/* User Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {user ? (
                  <>
                    <Button
                      onClick={handleUserMenuOpen}
                      sx={{
                        bgcolor: 'white',
                        color: 'text.primary',
                        borderRadius: 50,
                        px: 2,
                        py: 0.8,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: 'grey.100'
                        }
                      }}
                    >
                      {user.name}
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleUserMenuClose}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem onClick={() => { 
                        handleUserMenuClose();
                        navigate('/dashboard');
                      }}>
                        <PersonIcon sx={{ mr: 1 }} fontSize="small" />
                        View Profile
                      </MenuItem>
                      <Divider />
                      <MenuItem 
                        onClick={() => {
                          handleUserMenuClose();
                          logout();
                        }}
                        sx={{ color: 'error.main' }}
                      >
                        <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  !isMobile && (
                    <>
                      <Button 
                        variant="contained" 
                        color="secondary"
                        onClick={handleRegisterOpen}
                        sx={{ 
                          borderRadius: 50,
                          px: 3,
                          mr: 2,
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Register
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="inherit"
                        component={Link}
                        to="/Login"
                        sx={{ 
                          borderRadius: 50,
                          px: 3,
                          borderColor: 'white',
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: theme.palette.secondary.light,
                            bgcolor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                      >
                        Login
                      </Button>
                    </>
                  )
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      <Toolbar /> {/* Empty toolbar for spacing */}

      {/* Mobile Menu Drawer */}
      <Dialog
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: theme.palette.primary.main,
            color: 'white',
            height: '100vh',
            maxHeight: '100vh',
            position: 'fixed',
            right: 0,
            top: 0,
            m: 0,
            borderRadius: 0,
            width: '80%',
          }
        }}
        TransitionProps={{
          enter: theme.transitions.duration.standard,
          exit: theme.transitions.duration.standard,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <IconButton color="inherit" onClick={handleMobileMenuToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/About"
            onClick={handleMobileMenuToggle}
            sx={{ justifyContent: 'flex-start', fontSize: '1.2rem', textTransform: 'none' }}
          >
            About
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/Packages"
            onClick={handleMobileMenuToggle}
            sx={{ justifyContent: 'flex-start', fontSize: '1.2rem', textTransform: 'none' }}
          >
            Packages
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/Destination"
            onClick={handleMobileMenuToggle}
            sx={{ justifyContent: 'flex-start', fontSize: '1.2rem', textTransform: 'none' }}
          >
            Destination
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/Booking"
            onClick={handleMobileMenuToggle}
            sx={{ justifyContent: 'flex-start', fontSize: '1.2rem', textTransform: 'none' }}
          >
            Booking
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/Contact"
            onClick={handleMobileMenuToggle}
            sx={{ justifyContent: 'flex-start', fontSize: '1.2rem', textTransform: 'none' }}
          >
            Contact
          </Button>
          
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 2 }} />
          
          {!user && (
            <>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => {
                  handleMobileMenuToggle();
                  handleRegisterOpen();
                }}
                sx={{ 
                  borderRadius: 50,
                  py: 1,
                  mb: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Register
              </Button>
              <Button 
                variant="outlined" 
                color="inherit"
                component={Link}
                to="/Login"
                onClick={handleMobileMenuToggle}
                sx={{ 
                  borderRadius: 50,
                  py: 1,
                  borderColor: 'white',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Login
              </Button>
            </>
          )}
        </Box>
      </Dialog>

      {/* Registration Dialog */}
      <Dialog 
        open={registerOpen} 
        onClose={handleRegisterClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <Typography variant="h4" component="div" fontWeight="bold">
            Your Adventure Starts Now
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Receive our exclusive travel deals now!
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleRegisterClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              autoComplete="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ 
                mt: 2, 
                mb: 4, 
                py: 1.5, 
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                borderRadius: 2
              }}
            >
              Submit
            </Button>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" onClick={handleLoginRedirect} style={{ color: theme.palette.primary.main }}>
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
