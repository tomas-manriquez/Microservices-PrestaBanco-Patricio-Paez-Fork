import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography, TextField, Stack } from "@mui/material";
import CustomerService from "../services/customer.service.js";

const CustomerDebts = () => {

    const [userInfo, setUserInfo] = useState({
        debts: {},
    });

    useEffect(() => {
        CustomerService
            .get(localStorage.getItem('id'))
            .then(response => {
                setUserInfo(response.data);
            })
            .catch(error => console.error("Error loading the information:", error));
    }, []);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    return (
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <Typography variant="h5" component="div" gutterBottom>
                    Your debts
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Name"
                        name="name"
                        value={userInfo.name}
                        onChange={handleChange}
                        fullWidth
                    />
                </Stack>
            </Box>
    );
};

export default CustomerDebts;
