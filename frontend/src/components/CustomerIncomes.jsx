import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography, TextField, Stack } from "@mui/material";
import CustomerService from "../services/customer.service.js";

const CustomerIncomes = () => {

    const [userInfo, setUserInfo] = useState({
        incomes: {},
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

    const UpdateInfo = () => {
        CustomerService
            .update(userInfo)
            .then(() => {
                alert("Updated info successfully.");
            })
            .catch(error => console.error("Error updating the information:", error));
    };
    return (
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <Typography variant="h5" component="div" gutterBottom>
                    Your incomes
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

export default CustomerIncomes;
