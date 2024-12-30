import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';

const Home = () => {
    return (
        <Container maxWidth="lg">
            <Box display="flex" flexDirection="column" alignItems="center" py={5}>
                <Typography variant="h3" fontWeight="bold" gutterBottom align="center" color="primary">
                    Welcome to PrestaBanco Insurance
                </Typography>
                <Typography variant="body1" align="center" paragraph color="textSecondary" maxWidth="800px">
                    At PrestaBanco Insurance, we provide comprehensive insurance solutions to protect you and your loved ones.
                    Explore our range of services and stay informed with our latest articles.
                </Typography>
            </Box>
            <Box py={5}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                    Our Services
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Life Insurance
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Secure your family's future with our comprehensive life insurance plans.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Health Insurance
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Get the best health coverage for you and your family with our flexible health insurance options.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Auto Insurance
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Protect your vehicle with our reliable auto insurance policies.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <Box py={5}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                    Recent Articles
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Understanding Life Insurance
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Learn the basics of life insurance and how it can benefit you and your family.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Tips for Choosing Health Insurance
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Discover tips and tricks for selecting the best health insurance plan for your needs.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Home;