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
                                src={user.avatarUrl || 'data:image/jpeg;base64,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'} // Use user's avatar if available
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
