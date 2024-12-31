import React from 'react';
import {AppBar, Toolbar, IconButton, Button, Box, Typography, MenuItem, Select} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NavbarExecutive = () => {
    const isUserLoggedIn = Boolean(localStorage.getItem('tokenExe'));
    const { t, i18n } = useTranslation();

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
                            <Button color="inherit" startIcon={<LoginIcon />} component={Link} to="/executive/login">
                                {t("login")}
                            </Button>
                        </>
                    )}

                    {isUserLoggedIn && (
                        <>
                            <Button color="inherit" startIcon={<AccountCircle />} component={Link} to="/executive/management">
                                {t("management")}
                            </Button>
                            <Button color="inherit" startIcon={<AccountCircle />} component={Link} to="/executive/profile/personal-information">
                                {t("profile")}
                            </Button>
                            <Button color="inherit" startIcon={<LogoutIcon />} onClick={() => {
                                localStorage.removeItem('tokenExe');
                                window.location.href = '/executive/home';
                            }}>
                                {t("logout")}
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

export default NavbarExecutive;
