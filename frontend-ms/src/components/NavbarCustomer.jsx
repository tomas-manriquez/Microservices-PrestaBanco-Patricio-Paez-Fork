import React, { useEffect, useState } from 'react';
import {AppBar, Toolbar, IconButton, Button, Box, Typography} from '@mui/material';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import RegisterIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import { Link, Outlet } from 'react-router-dom';

const NavbarCustomer = () => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(Boolean(localStorage.getItem('token')));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsUserLoggedIn(Boolean(localStorage.getItem('token')));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        setIsUserLoggedIn(false);
        window.location.href = '/home';
    };

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
                            <Button color="inherit" startIcon={<LoginOutlinedIcon />} component={Link} to="/customer/login">
                                Login
                            </Button>
                            <Button color="inherit" startIcon={<RegisterIcon />} component={Link} to="/customer/register">
                                Register
                            </Button>
                        </>
                    )}

                    {isUserLoggedIn && (
                        <>
                            <Button color="inherit" startIcon={<CreditScoreIcon />} component={Link} to="/customer/loans">
                                Loans
                            </Button>
                            <Button color="inherit" startIcon={<CreditScoreIcon />} component={Link} to="/customer/simulation">
                                Simulate
                            </Button>
                            <Button color="inherit" startIcon={<AccountCircle />} component={Link} to="/customer/profile/personal-information">
                                Profile
                            </Button>
                            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
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

export default NavbarCustomer;
