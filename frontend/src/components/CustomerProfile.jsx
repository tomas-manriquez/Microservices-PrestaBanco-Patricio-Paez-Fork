import React from 'react';
import Box from '@mui/material/Box';
import SideMenu from './SidebarCustomerProfile.jsx';
import {Outlet} from "react-router-dom";

const CustomerProfile = () => {

    return (
        <Box sx={{ display: 'flex', paddingTop: '64px' }}>
            <SideMenu />
            <Outlet />
        </Box>
    );
};

export default CustomerProfile;
