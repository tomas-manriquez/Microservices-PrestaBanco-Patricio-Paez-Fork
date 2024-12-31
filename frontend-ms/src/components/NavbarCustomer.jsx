import React, { useEffect, useState } from 'react';
import {AppBar, Toolbar, IconButton, Button, Box, Typography, MenuItem, Select} from '@mui/material';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import RegisterIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NavbarCustomer = () => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(Boolean(localStorage.getItem('token')));
    const { t, i18n } = useTranslation();

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

    const handleLanguageChange = (event) => {
        i18n.changeLanguage(event.target.value);
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
                            <Button color="inherit" startIcon={<CreditScoreIcon />} component={Link} to="/customer/simulation">
                                {t('simulate')}
                            </Button>
                            <Button color="inherit" startIcon={<LoginOutlinedIcon />} component={Link} to="/customer/login">
                                {t('login')}
                            </Button>
                            <Button color="inherit" startIcon={<RegisterIcon />} component={Link} to="/customer/register">
                                {t('register')}
                            </Button>
                        </>
                    )}

                    {isUserLoggedIn && (
                        <>
                            <Button color="inherit" startIcon={<CreditScoreIcon />} component={Link} to="/customer/loans">
                                {t('loans')}
                            </Button>

                            <Button color="inherit" startIcon={<AccountCircle />} component={Link} to="/customer/profile/personal-information">
                                {t('profile')}
                            </Button>
                            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                                {t('logout')}
                            </Button>
                        </>
                    )}
                    <Select
                        value={i18n.language}
                        onChange={handleLanguageChange}
                        sx={{ color: 'white', ml: 'auto' }}
                    >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Español</MenuItem>
                    </Select>
                </Toolbar>
            </AppBar>
            <Outlet />
        </Box>
    );
};

export default NavbarCustomer;
