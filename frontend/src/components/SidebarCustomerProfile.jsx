import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import MenuContent from './MenuContent';

const Drawer = styled(MuiDrawer)({
    width: 240,
    flexShrink: 0,
    boxSizing: 'border-box',
    [`& .${drawerClasses.paper}`]: {
        width: 240,
        boxSizing: 'border-box',
        marginTop: '64px',
    },
});

export default function SideMenu() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', md: 'block' },
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: 'background.paper',
                },
            }}
        >
            <Divider />
            <MenuContent />
        </Drawer>
    );
}
