import React from 'react';
import {Box, Card, CardActionArea, CardContent, Divider, IconButton, Typography} from '@mui/material';
import {Link} from "react-router-dom";

const Home = () => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={2}>
            <Card sx={{ p: 4, borderRadius: 5, width: '90%', maxWidth: '1200px', boxShadow: 3, height: '90%', maxHeight: '1900px', minHeight: '80vh' }}>
                <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to="/home">
                    <Typography variant="h6" color="inherit">
                        PrestaBanco
                    </Typography>
                </IconButton>


                <Box  display="flex" justifyContent="space-around" alignItems="center" flexWrap="wrap" width="100%" gap={2}>


                    <Card component={Link} to="/customer/home" sx={{ minHeight: '20vh', p: 2, width: '100%', maxWidth: '30%', borderRadius: 2, border: '1px solid #ccc', boxShadow: 1 }}>
                        <CardActionArea component={Link} to="/customer/home" sx={{ height: '100%', width: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" component="div" gutterBottom>
                                    Customer Section (Chile)
                                </Typography>
                                <Divider />
                                <Typography variant="body2" align="justify" sx={{ color: 'text.secondary' }}>
                                    - Simulate a loan<br />
                                    - Manage personal information<br />
                                    - View loan status
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                    <Card component={Link} to="/executive/home" sx={{ position:'flex' , minHeight: '20vh', p: 2, width: '100%', maxWidth: '30%', borderRadius: 2, border: '1px solid #ccc', boxShadow: 1 }}>
                        <CardActionArea component={Link} to="/executive/home" sx={{ height: '100%', width: '100%' }}>
                            <Typography variant="h6" component="div" gutterBottom>
                                Executive Section
                            </Typography>
                            <Divider />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                - Check requests<br />
                                - Approve or reject loans
                            </Typography>
                        </CardActionArea>
                    </Card>
                </Box>
            </Card>
        </Box>
    );
};

export default Home;
