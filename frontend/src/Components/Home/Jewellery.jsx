import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Container, Typography, TextField, Button, Grid, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';


const URL = "http://localhost:4000/jewellery";

const fetchJewellery = async () => {
  try {
    const response = await axios.get(URL);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

function JewelleryPage() {
  const [jewellery, setJewellery] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJewellery().then(data => {
      setJewellery(data);
    }).catch(error => {
      console.error("Error fetching jewellery:", error);
    });
  }, []);

  const handleSearch = (query = searchQuery) => {
    if (query.trim() === "") {
      fetchJewellery().then(data => {
        setJewellery(data);
      }).catch(error => {
        console.error("Error fetching jewellery:", error);
      });
      return;
    }

    const filteredJewellery = jewellery.filter(item =>
      Object.values(item).some(field =>
        field && field.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
    setJewellery(filteredJewellery);
  };

  const sampleSearchButtons = [
    { label: 'Rings', query: 'ring' },
    { label: 'Necklaces', query: 'necklace' },
    { label: 'Bracelets', query: 'bracelet' },
    { label: 'Earrings', query: 'earring' }
  ];

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Header />
      <br></br>
      <Container>
        <Grid container justifyContent="left" alignItems="left" spacing={2} sx={{ marginBottom: '20px' }}>
          <Grid item>
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: '300px',
                backgroundColor: 'white',
                borderRadius: 1,
                padding: '1px'
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSearch()}
              sx={{
                borderRadius: 2,
                padding: '10px 20px',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
              }}
            >
              Search
            </Button>
          </Grid>

          {sampleSearchButtons.map(button => (
            <Grid item key={button.label}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleSearch(button.query)}
                sx={{
                  borderRadius: 2,
                  padding: '10px 20px',
                  backgroundColor: '#ffffff',
                  color: '#000',
                  border: '1px solid #ccc'
                }}
              >
                {button.label}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" align="left" gutterBottom sx={{ marginTop: '20px', fontWeight: 'bold' }}>
          Swipe into our everyday wear collection
        </Typography>
        <Swiper
          spaceBetween={20}
          slidesPerView={4}
          navigation
          breakpoints={{
            320: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            960: { slidesPerView: 3 },
            1280: { slidesPerView: 4 }
          }}


        >

          {jewellery.map(item => (
            <SwiperSlide key={item._id}>
              <Card
                sx={{
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <Link to={`/jewellery/${item._id}`}>
                  <CardMedia
                    component="img"
                    alt={item.name}
                    height="290"
                    image={item.image || 'http://localhost:5173/src/Components/Images/3.png'}
                    title={item.name}
                  />
                </Link>
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.price}
                  </Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      <Footer />
    </div>
  );
}

export default JewelleryPage;