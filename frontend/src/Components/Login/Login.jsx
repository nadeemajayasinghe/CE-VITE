import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Box, Button, Container, Grid, TextField, Typography, Paper, Divider } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Logo from '../Images/3.png';

function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:4000/auth/login", {
                name: user.name,
                password: user.password,
            });

            if (response.status === 200) {
                alert("Login Successfully");

                // Check user type and redirect accordingly
                if (response.data.user.type === "admin") {
                    navigate("/admindashboard");
                } else {
                    navigate("/userprofile");
                }
            } else {
                alert("Login Error: " + response.data.message);
            }
        } catch (err) {
            // Handle different types of errors
            if (err.response && err.response.status === 404) {
                alert("User not found");
            } else if (err.response && err.response.status === 400) {
                alert("Invalid credentials");
            } else {
                alert("Error: " + err.message);
            }
        }
    };

    return (
        <Box sx={{ backgroundColor: '#FAF2F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingY: 5 }}>
                <Paper elevation={6} sx={{ paddingRight: 4, paddingLeft: 4, paddingTop: 4, borderRadius: 2, maxWidth: 900 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8D9D9', borderRadius: 2 }}>
                            <img src={Logo} alt="Crystal Elegance" style={{ maxWidth: '100%', paddingRight: 30, height: '50vh', paddingBottom: 30 }} />
                        </Grid>
                        <Grid item xs={12} sm={7}>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                                LOGIN
                            </Typography>
                            <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                                We add elegance to your freedom
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Username or Email"
                                    variant="outlined"
                                    name="name"
                                    value={user.name}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        startAdornment: <PersonIcon color="disabled" />,
                                        sx: { backgroundColor: '#FDF2F2', borderRadius: 2 }
                                    }}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    placeholder="Password"
                                    type="password"
                                    variant="outlined"
                                    name="password"
                                    value={user.password}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        startAdornment: <LockIcon color="disabled" />,
                                        sx: { backgroundColor: '#FDF2F2', borderRadius: 2 }
                                    }}
                                    sx={{ marginBottom: 3 }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ backgroundColor: '#F8B9B7', color: '#fff', paddingY: 1.5, borderRadius: 2, boxShadow: 'none', textTransform: 'none', fontWeight: 'bold' }}
                                >
                                    Login Now
                                </Button>
                                <Divider sx={{ marginY: 2 }}>
                                    <Typography variant="body2">Login with Others</Typography>
                                </Divider>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
            <Footer />
        </Box>
    );
}

export default Login;
