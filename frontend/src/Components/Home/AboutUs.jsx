import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Header from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import footerLogo from '../Images/3.png'; // Adjust the path according to your project structure
import { Container, Typography, Box, Grid } from '@mui/material'; // Import MUI components

function AboutUs() {
  return (
    <div style={{ backgroundColor: '#FAF2F2', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="md" sx={{ paddingY: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          About Us
        </Typography>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={10}>
            <Box sx={{ textAlign: 'left', paddingX: 2 }}>
              <Typography variant="body1" paragraph>
                Welcome to Crystal Elegance, your number one source for exquisite jewelry and gemstones.
                We are dedicated to giving you the very best of luxury with a focus on quality, customer service, and uniqueness.
              </Typography>
              <Typography variant="body1" paragraph>
                Founded in 2024, Crystal Elegance has come a long way from its beginnings. When we first started out,
                our passion for beautiful gemstones and elegant designs drove us to start our own business.
                We hope you enjoy our products as much as we enjoy offering them to you.
              </Typography>
              <Typography variant="body1" paragraph>
                If you have any questions or comments, please don't hesitate to{' '}
                <Link to="/Contact" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                  contact us
                </Link>.
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <img src={footerLogo} alt="Logo" style={{ height: '17vh', objectFit: 'contain',paddingBottom: 100 }} />
              <Typography variant="body2" sx={{ color: 'black' }}>
                &copy; {new Date().getFullYear()} Crystal Elegance.
              </Typography>
            </Box>

          </Grid>
        </Grid>
      </Container>
      <Footer />
    </div>
  );
}

export default AboutUs;