import React from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import RequestPageRoundedIcon from '@mui/icons-material/RequestPageRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useTranslation } from 'react-i18next';

const ListItems = [
    { text: 'personal_information', icon: <AccountCircleRoundedIcon />, path: '/customer/profile/personal-information' },
    { text: 'requests', icon: <RequestPageRoundedIcon />, path: '/customer/profile/requests' },
];

export default function MenuContent() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleListItemClick = (index, path) => {
        setSelectedIndex(index);
        navigate(path);
    };

    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <List dense>
                {ListItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            selected={selectedIndex === index}
                            onClick={() => handleListItemClick(index, item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={t(item.text)} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}