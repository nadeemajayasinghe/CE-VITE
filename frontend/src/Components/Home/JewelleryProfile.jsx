import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Grid, Card, CardMedia, CardContent, Box, Snackbar, Alert, IconButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import AddFeedback from '../Admin/Feedback/AddFeedback2'; // Ensure you have this component
import { AuthContext } from '../Auth/AuthContext'; // Import AuthContext
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon

const JewelleryProfile = () => {
  const [jewellery, setJewellery] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const { id: jewelleryId } = useParams();
  const [noResults, setNoResults] = useState(false);
  const [showAddFeedbackForm, setShowAddFeedbackForm] = useState(false);
  const [images, setImages] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const URL = 'http://localhost:4000/feedback';
  const { authState } = useContext(AuthContext); // Access authentication state
  const navigate = useNavigate(); // Use navigate for redirection

  // Fetch jewellery details
  useEffect(() => {
    axios.get(`http://localhost:4000/jewellery/${jewelleryId}`)
      .then(response => {
        setJewellery(response.data);
        setImages(response.data.images || []); // Assuming images is an array of URLs
      })
      .catch(error => console.error('Error fetching jewellery:', error));
  }, [jewelleryId]);

  // Fetch feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(URL);
        const filteredFeedbacks = response.data.filter(feedback => feedback.jewelleryId === jewellery.JID);
        setFeedbacks(filteredFeedbacks);
        setNoResults(filteredFeedbacks.length === 0);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    if (jewellery) {
      fetchFeedbacks();
    }
  }, [jewellery]);

  const handleAddToBag = () => {
    if (!authState.user) {
      setSnackbarMessage('You need to be logged in to add items to the bag.');
      setSnackbarOpen(true);
    } else {
      // Logic for adding to bag
      alert('Added to bag!');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRedirectToLogin = () => {
    navigate('/login');
    setSnackbarOpen(false); // Close the Snackbar after redirecting
  };

  if (!jewellery) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <Container>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                alt={jewellery.name}
                height="500"
                image={jewellery.image || 'http://localhost:5173/src/Components/Images/3.png'}
                title={jewellery.name}
              />
              <CardContent>
                {/* Display images as a list if carousel is not available */}
                <Box sx={{ display: 'flex', overflowX: 'auto' }}>
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Image ${index}`}
                      style={{ width: '100%', maxWidth: '300px', marginRight: '10px' }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3">{jewellery.name}</Typography>
            <Typography variant="body1">{jewellery.description}</Typography>
            <Typography variant="h4">Rs {jewellery.price}</Typography>
            <br /><br /><br /><br />
            <Button variant="contained" color="secondary" onClick={handleAddToBag}>Add to Bag</Button>
            <br /><br />
            <Button variant="outlined">Contact Customer Care</Button>
            <br /><br />
            <Button variant="outlined" color="primary" onClick={() => alert('Added to wishlist!')}>Add to Wishlist</Button>
            <br /><br />
            <Button variant="outlined" color="secondary" onClick={() => setShowAddFeedbackForm(!showAddFeedbackForm)}>
              {showAddFeedbackForm ? 'Cancel' : 'Add Feedback'}
            </Button>
          </Grid>
        </Grid>

        <Box>
          {showAddFeedbackForm ? (
            <AddFeedback
              jewelleryId={jewellery.JID}
              onBack={() => setShowAddFeedbackForm(false)}
            />
          ) : (
            <Box sx={{ padding: 3 }}>
              {noResults ? (
                <Typography variant="h6" align="center">No feedback found.</Typography>
              ) : (
                feedbacks.map((feedback) => (
                  <Card key={feedback._id} sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography variant="h6">Customer Name: {feedback.customerId}</Typography>
                      <Typography variant="body1">Rating: {feedback.rating}</Typography>
                      <Typography variant="body2">{feedback.comment}</Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          )}
        </Box>
      </Container>
      <Footer />

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={null} // Disable auto-hide for custom action
        onClose={handleSnackbarClose}
        action={
          <Button color="inherit" onClick={handleRedirectToLogin}>OK</Button>
        }
      >
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default JewelleryProfile;
