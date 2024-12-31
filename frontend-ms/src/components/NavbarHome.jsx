import React from 'react';
import { AppBar, Toolbar, IconButton, Button, Box, Typography, Select, MenuItem } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NavbarHome = () => {
    const { t, i18n } = useTranslation();

    const handleLanguageChange = (event) => {
        i18n.changeLanguage(event.target.value);
    };

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
                        {t('customer_portal')}
                    </Button>
                    <Button color="inherit" component={Link} to="/executive/home" sx={{ mx: 1 }}>
                        {t('executive_portal')}
                    </Button>
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
            <Toolbar />
            <Outlet />
        </Box>
    );
};

export default NavbarHome;