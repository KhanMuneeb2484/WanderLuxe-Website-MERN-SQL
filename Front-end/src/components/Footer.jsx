
import React from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  IconButton, 
  Link,
  Divider,
  useTheme
} from "@mui/material";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  YouTube,
  Phone,
  Email
} from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box 
      component="footer" 
      sx={{
        bgcolor: theme.palette.primary.main,
        color: '#fff',
        py: 6,
        mt: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              About Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              Discover the beauty of Pakistan with our exclusive travel packages and
              expert guides. Whether you seek adventure, cultural experiences, or a
              tranquil getaway, we are here to make your journey unforgettable.
              Explore the rich heritage, scenic landscapes, and vibrant cities with
              us!
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">+92 123 456 7890</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">info@pakistantravel.com</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Follow Us
            </Typography>
            <Box>
              <IconButton 
                href="https://www.facebook.com" 
                target="_blank"
                sx={{ color: '#fff', '&:hover': { color: theme.palette.secondary.light } }}
              >
                <Facebook />
              </IconButton>
              <IconButton 
                href="https://www.twitter.com" 
                target="_blank"
                sx={{ color: '#fff', '&:hover': { color: theme.palette.secondary.light } }}
              >
                <Twitter />
              </IconButton>
              <IconButton 
                href="https://www.instagram.com" 
                target="_blank"
                sx={{ color: '#fff', '&:hover': { color: theme.palette.secondary.light } }}
              >
                <Instagram />
              </IconButton>
              <IconButton 
                href="https://www.youtube.com" 
                target="_blank"
                sx={{ color: '#fff', '&:hover': { color: theme.palette.secondary.light } }}
              >
                <YouTube />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 3 }} />
        
        <Typography 
          variant="body2" 
          align="center" 
          sx={{ 
            pt: 1, 
            opacity: 0.9 
          }}
        >
          © 2024 Wander Luxe. All rights reserved. Designed and developed by{" "}
          <Link 
            href="https://suavesolutions.com" 
            color="inherit" 
            sx={{ 
              fontWeight: 500, 
              '&:hover': { color: theme.palette.secondary.light } 
            }}
            target="_blank"
          >
            Muneeb Ullah
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
