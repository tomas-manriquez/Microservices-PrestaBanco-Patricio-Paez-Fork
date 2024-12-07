import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography, TextField, Button, Stack, Checkbox, FormControlLabel } from "@mui/material";
import CustomerService from "../services/customer.service.js";
import FormControl from "@mui/material/FormControl";

const CustomerPersonalInformation = () => {

    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
        rut: "",
        name: "",
        dadSurname: "",
        motherSurname: "",
        age: "",
        working: false,
        workingYears: "",
        independentWorker: false,
        latePayments: false,
        amountOfLatePayments: "",
        minCashOnAccount: false,
        consistentSaveHistory: false,
        periodicDeposits: false,
        relationYearsAndBalance: false,
        recentWithdraws: false,
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
                    Hello, {userInfo.name} {userInfo.dadSurname} {userInfo.motherSurname}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                    Detailed info.
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Name"
                        name="name"
                        value={userInfo.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Father's Surname"
                        name="dadSurname"
                        value={userInfo.dadSurname}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Mother's Surname"
                        name="motherSurname"
                        value={userInfo.motherSurname}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Age"
                        name="age"
                        value={userInfo.age}
                        onChange={handleChange}
                        fullWidth
                    />
                    <FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={userInfo.working}
                                    onChange={(e) => handleChange(e)}
                                    name="working"
                                />
                            }
                            label="Working?"
                        />

                        <TextField
                            id="workingYears"
                            label="Working Years"
                            type="number"
                            name="workingYears"
                            value={userInfo.workingYears}
                            onChange={handleChange}
                            disabled={!userInfo.working}
                            variant="outlined"
                            fullWidth
                            required={userInfo.working}
                        />
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={userInfo.independentWorker}
                                onChange={handleChange}
                                name="independentWorker"
                            />
                        }
                        label="Independent Worker?"
                    />
                    <FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={userInfo.latePayments}
                                    onChange={handleChange}
                                    name="latePayments"
                                />
                            }
                            label="Late Payments?"
                        />
                        <TextField
                            id="latePayments"
                            label="Late Payments"
                            type="number"
                            name="amountOfLatePayments"
                            value={userInfo.amountOfLatePayments}
                            onChange={handleChange}
                            disabled={!userInfo.latePayments}
                            variant="outlined"
                            fullWidth
                            required={userInfo.latePayments}
                        />
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={userInfo.minCashOnAccount}
                                onChange={handleChange}
                                name="minCashOnAccount"
                            />
                        }
                        label="Has the minimum amount of money in account?"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={userInfo.consistentSaveHistory}
                                onChange={handleChange}
                                name="consistentSaveHistory"
                            />
                        }
                        label="Consistent save history?"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={userInfo.periodicDeposits}
                                onChange={handleChange}
                                name="periodicDeposits"
                            />
                        }
                        label="Does periodic deposits?"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={userInfo.relationYearsAndBalance}
                                onChange={handleChange}
                                name="relationYearsAndBalance"
                            />
                        }
                        label="Good relation between years and balance?"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={userInfo.recentWithdraws}
                                onChange={handleChange}
                                name="recentWithdraws"
                            />
                        }
                        label="Recent withdraws?"
                    />

                    <Button variant="contained" color="primary" onClick={UpdateInfo}>
                        Update info
                    </Button>
                </Stack>
            </Box>
    );
};

export default CustomerPersonalInformation;
