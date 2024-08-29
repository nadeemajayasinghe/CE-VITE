/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // If using React Router v6
import { Box, Button, Container, Grid, Typography, Paper, Avatar, TextField, IconButton } from '@mui/material';
import { Edit, Lock, Delete, Logout, ArrowBack } from '@mui/icons-material';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { AuthContext } from '../Auth/AuthContext';
import axios from 'axios';

function UserProfile() {
    const { authState, logout } = useContext(AuthContext);
    const { user, token } = authState;
    const navigate = useNavigate(); // If using React Router v6
    const [editing, setEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({
        userName: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        type: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (user && user.userId) {
                try {
                    const response = await axios.get(`http://localhost:4000/users/${user.userId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setUpdatedUser(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setError('Error fetching user data');
                    setLoading(false);
                }
            }
        };

        fetchUser();
    }, [user, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser({ ...updatedUser, [name]: value });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:4000/users/${user.userId}`, updatedUser, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Profile updated successfully');
            setEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            setError('Error updating profile');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:4000/users/${user.userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Profile deleted successfully');
            logout(); // Clear user data in context
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error("Error deleting profile:", error);
            setError('Error deleting profile');
        }
    };

    const handleLogout = () => {
        logout();  // Clear user data in context
        navigate('/login');  // Redirect to login page
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ backgroundColor: '#F8DADA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingY: 7 }}>
                <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, maxWidth: 900, width: '100%', display: 'flex', height: '100%' }}>
                    <Grid container sx={{ height: '100%' }}>
                        {/* Left side: Avatar and Buttons */}
                        <Grid 
                            item 
                            xs={12} 
                            sm={4} 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                backgroundColor: '#FFD1D1', 
                                height: '100%',
                                padding: 3 
                            }}
                        >
                            <Avatar
                                src={user.avatarUrl || 'https://i.imgur.com/123.jpg'} // Use user's avatar if available
                                alt={user.name}
                                sx={{ width: 120, height: 120, marginBottom: 2 }}
                            />
                            {!editing && (
                                <>
                                    <Button
                                        variant="contained"
                                        startIcon={<Edit />}
                                        fullWidth
                                        sx={{ marginBottom: 2, backgroundColor: '#ffffff', color: '#000', textTransform: 'none' }}
                                        onClick={() => setEditing(true)}
                                    >
                                        Edit Account
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<Lock />}
                                        fullWidth
                                        sx={{ marginBottom: 2, backgroundColor: '#ffffff', color: '#000', textTransform: 'none' }}
                                    >
                                        Change Password
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<Delete />}
                                        fullWidth
                                        sx={{ marginBottom: 2, backgroundColor: '#ffffff', color: '#000', textTransform: 'none' }}
                                        onClick={handleDelete}
                                    >
                                        Delete Account
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<Logout />} // Logout icon
                                        fullWidth
                                        sx={{ backgroundColor: '#ffffff', color: '#000', textTransform: 'none' }}
                                        onClick={handleLogout} // Handle logout on click
                                    >
                                        Logout
                                    </Button>
                                </>
                            )}
                        </Grid>

                        {/* Right side: Account Information */}
                        <Grid item xs={12} sm={8} sx={{ paddingLeft: 3 }}>
                            {editing ? (
                                <>
                                    <IconButton onClick={() => setEditing(false)} sx={{ marginBottom: 2 }}>
                                        <ArrowBack />
                                    </IconButton>
                                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        Edit Profile
                                    </Typography>
                                    {error && <Typography color="error">{error}</Typography>}
                                    <TextField
                                        label="Username"
                                        name="userName"
                                        value={updatedUser.userName}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Name"
                                        name="name"
                                        value={updatedUser.name}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Email"
                                        name="email"
                                        value={updatedUser.email}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Phone"
                                        name="phone"
                                        value={updatedUser.phone}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleUpdate}
                                        sx={{ marginTop: 2 }}
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => setEditing(false)}
                                        sx={{ marginTop: 2, marginLeft: 2 }}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        MY ACCOUNT
                                    </Typography>
                                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                        <strong>Name:</strong> {user.name}
                                    </Typography>
                                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                        <strong>Email:</strong> {user.email}
                                    </Typography>
                                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                        <strong>Phone:</strong> {user.phone}
                                    </Typography>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
            <Footer />
        </Box>
    );
}

export default UserProfile;
