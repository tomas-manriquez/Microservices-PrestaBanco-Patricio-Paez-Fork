import React from 'react';
import {AppBar, Toolbar, IconButton, Button, Box, Typography} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, Outlet } from 'react-router-dom';

const NavbarExecutive = () => {
    const isUserLoggedIn = Boolean(localStorage.getItem('tokenExe'));

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to="/home">
                        <Typography variant="h6" color="inherit">
                            PrestaBanco
                        </Typography>
                    </IconButton>

                    {!isUserLoggedIn && (
                        <>
                            <Button color="inherit" startIcon={<LoginIcon />} component={Link} to="/executive/login">
                                Login
                            </Button>
                        </>
                    )}

                    {isUserLoggedIn && (
                        <>
                            <Button color="inherit" startIcon={<AccountCircle />} component={Link} to="/executive/management">
                                Management
                            </Button>
                            <Button color="inherit" startIcon={<AccountCircle />} component={Link} to="/executive/profile/personal-information">
                                Profile
                            </Button>
                            <Button color="inherit" startIcon={<LogoutIcon />} onClick={() => {
                                localStorage.removeItem('tokenExe');
                                window.location.href = '/executive/home';
                            }}>
                                Logout
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Outlet />
        </Box>
    );
};

export default NavbarExecutive;
