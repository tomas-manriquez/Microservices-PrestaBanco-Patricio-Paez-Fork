import React from 'react';
import {useNavigate} from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import RequestPageRoundedIcon from '@mui/icons-material/RequestPageRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const ListItems = [
    { text: 'Personal Information', icon: <AccountCircleRoundedIcon />, path: '/customer/profile/personal-information' },
    { text: 'Requests', icon: <RequestPageRoundedIcon />, path: '/customer/profile/requests' },
];

export default function MenuContent() {
    const navigate = useNavigate();
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleListItemClick = (index, path) => {
        setSelectedIndex(index);
        navigate(path);
    };

    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between'}}>
            <List dense>
                {ListItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            selected={selectedIndex === index}
                            onClick={() => handleListItemClick(index, item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
