import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography, TextField, Button, Stack, Checkbox, FormControlLabel } from "@mui/material";
import CustomerService from "../services/customer.service.js";
import FormControl from "@mui/material/FormControl";
import { useTranslation } from 'react-i18next';
import MenuItem from "@mui/material/MenuItem";

const CustomerPersonalInformation = () => {
    const { t } = useTranslation();

    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
        rut: "",
        name: "",
        firstName: "",
        lastName: "",
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
                alert(t("updated_info_successfully"));
            })
            .catch(error => console.error("Error updating the information:", error));
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Typography variant="h5" component="div" gutterBottom>
                {t('hello')}, {userInfo.name} {userInfo.firstName} {userInfo.lastName}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                {t('detailed_info')}
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label={t('name')}
                    name="name"
                    value={userInfo.name}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label={t("first_name")}
                    name="dadSurname"
                    value={userInfo.firstName}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label={t("last_name")}
                    name="motherSurname"
                    value={userInfo.lastName}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label={t("age")}
                    name="age"
                    select
                    helperText={t("select_age")}
                    value={userInfo.age}
                    onChange={handleChange}

                >
                    {[...Array(83).keys()].map(i => (
                        <MenuItem key={i + 18} value={i + 18}>
                            {i + 18}
                        </MenuItem>
                    ))}
                </TextField>
                <FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={userInfo.working}
                                onChange={(e) => handleChange(e)}
                                name="working"
                            />
                        }
                        label={t("working")}
                    />

                    <TextField
                        id="workingYears"
                        label={t("working_years")}
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
                    label={t("independent_worker")}
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
                        label={t("late_payments")}
                    />
                    <TextField
                        id="latePayments"
                        label={t("amount_of_late_payments")}
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
                    label={t("min_cash_on_account")}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={userInfo.consistentSaveHistory}
                            onChange={handleChange}
                            name="consistentSaveHistory"
                        />
                    }
                    label={t("consistent_save_history")}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={userInfo.periodicDeposits}
                            onChange={handleChange}
                            name="periodicDeposits"
                        />
                    }
                    label={t("periodic_deposits")}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={userInfo.relationYearsAndBalance}
                            onChange={handleChange}
                            name="relationYearsAndBalance"
                        />
                    }
                    label={t("relation_years_and_balance")}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={userInfo.recentWithdraws}
                            onChange={handleChange}
                            name="recentWithdraws"
                        />
                    }
                    label={t("recent_withdraws")}
                />

                <Button variant="contained" color="primary" onClick={UpdateInfo}>
                    {t("update_info")}
                </Button>
            </Stack>
        </Box>
    );
};

export default CustomerPersonalInformation;