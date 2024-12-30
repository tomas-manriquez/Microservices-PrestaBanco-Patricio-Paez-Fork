import React from 'react';
import { AppBar, Toolbar, IconButton, Button, Box, Typography } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

const NavbarHome = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ backgroundColor: '#1976d2' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to="/home" sx={{ mr: 2 }}>
                        <Typography variant="h6" color="inherit">
                            PrestaBanco
                        </Typography>
                    </IconButton>
                    <Button color="inherit" component={Link} to="/customer/home" sx={{ mx: 1 }}>
                        Customer's portal
                    </Button>
                    <Button color="inherit" component={Link} to="/executive/home" sx={{ mx: 1 }}>
                        Executive's portal
                    </Button>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Outlet />
        </Box>
    );
};

export default NavbarHome;