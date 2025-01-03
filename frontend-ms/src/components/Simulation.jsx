import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    MenuItem,
    Typography,
    Box,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    Alert,
} from '@mui/material';
import SimulationService from '../services/simulation.service.js';
import { useTranslation } from 'react-i18next';

const MinimalistDialog = ({ open, onClose, title, content, actions }) => {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {title}
            </DialogTitle>
            <DialogContent sx={{ padding: '2rem', textAlign: 'center' }}>
                {content}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', padding: '1rem' }}>
                {actions}
            </DialogActions>
        </Dialog>
    );
};

const Simulation = ({ loanTypes = [
    { type: 'loan_types.first_house', value: 1, minInterest: 3.5, maxInterest: 5, maxPercentage: 0.8, maxYears: 30 },
    { type: 'loan_types.second_house', value: 2, minInterest: 4, maxInterest: 6, maxPercentage: 0.7, maxYears: 20 },
    { type: 'loan_types.commercial_properties', value: 3, minInterest: 5, maxInterest: 7, maxPercentage: 0.6, maxYears: 25 },
    { type: 'loan_types.remodeling', value: 4, minInterest: 4.5, maxInterest: 6, maxPercentage: 0.5, maxYears: 15 }
] }) => {
    const { t } = useTranslation();
    const [selectedLoanType, setSelectedLoanType] = useState('');
    const [propertyValue, setPropertyValue] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedInterest, setSelectedInterest] = useState('');
    const [calculationResult, setCalculationResult] = useState(null);
    const [totalCostResult, setTotalCostResult] = useState(null);
    const [openLoanDialog, setOpenLoanDialog] = useState(false);
    const [openTotalCostDialog, setOpenTotalCostDialog] = useState(false);
    const [isCalculateLoanDisabled, setIsCalculateLoanDisabled] = useState(true);
    const [isCalculateTotalCostDisabled, setIsCalculateTotalCostDisabled] = useState(true);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const currentLoanType = loanTypes.find((loan) => loan.value === selectedLoanType);

    useEffect(() => {
        setIsCalculateLoanDisabled(
            !selectedLoanType || !propertyValue || !selectedTime || !selectedInterest
        );
    }, [selectedLoanType, propertyValue, selectedTime, selectedInterest]);

    useEffect(() => {
        setIsCalculateTotalCostDisabled(
            !selectedLoanType || !propertyValue || !selectedTime || !selectedInterest
        );
    }, [selectedLoanType, propertyValue, selectedTime, selectedInterest]);

    const formatNumber = (value) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handlePropertyValueChange = (e) => {
        const value = e.target.value.replace(/\./g, '');
        if (/^\d*$/.test(value)) {
            setPropertyValue(formatNumber(value));
        }
    };

    const handleSelectedYearsChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setSelectedTime(value);
        }
    };

    const handleInterestRateChange = (e) => {
        const value = e.target.value.replace(',', '.');
        if (/^\d*\.?\d*$/.test(value)) {
            setSelectedInterest(value);
        }
    };

    const handleCalculateLoan = () => {
        const loanData = {
            selectedLoan: selectedLoanType,
            propertyValue: parseFloat(propertyValue.replace(/\./g, '')),
            years: parseInt(selectedTime),
            interestRate: parseFloat(selectedInterest),
            maxPercentage: currentLoanType?.maxPercentage || 0,
        };

        const { minInterest, maxInterest, maxYears } = currentLoanType;

        if (loanData.years > maxYears) {
            setError(`${t('max_years')}: ${maxYears}`);
            setSnackbarOpen(true);
            return;
        }

        if (loanData.interestRate < minInterest || loanData.interestRate > maxInterest) {
            setError(`${t('interest_rate')} ${minInterest}% - ${maxInterest}%`);
            setSnackbarOpen(true);
            return;
        }

        SimulationService.simulate(loanData)
            .then((response) => {
                setCalculationResult(response.data);
                setOpenLoanDialog(true);
                setError(null);
            })
            .catch(() => {
                setError(t('error_calculating_loan'));
                setSnackbarOpen(true);
            });
    };

    const handleCalculateTotalCost = () => {
        const totalCostData = {
            selectedLoan: selectedLoanType,
            propertyValue: parseFloat(propertyValue.replace(/\./g, '')),
            years: parseInt(selectedTime),
            interestRate: parseFloat(selectedInterest),
            maxPercentage: currentLoanType?.maxPercentage || 0,
        };

        const { minInterest, maxInterest, maxYears } = currentLoanType;

        if (totalCostData.years > maxYears) {
            setError(`${t('max_years')}: ${maxYears}`);
            setSnackbarOpen(true);
            return;
        }

        if (totalCostData.interestRate < minInterest || totalCostData.interestRate > maxInterest) {
            setError(`${t('interest_rate')} ${minInterest}% - ${maxInterest}%`);
            setSnackbarOpen(true);
            return;
        }

        SimulationService.totalcost(totalCostData)
            .then((response) => {
                setTotalCostResult(response.data);
                setOpenTotalCostDialog(true);
                setError(null);
            })
            .catch(() => {
                setError(t('error_calculating_total_cost'));
                setSnackbarOpen(true);
            });
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ backgroundColor: '#c5c1c1', padding: 3 }}>
            <Box display="flex" justifyContent="center" sx={{ width: '100%', maxWidth: 600 }}>
                <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                    <Typography variant="h4" align="center">{t('simulation')}</Typography>
                    <Box component="form">
                        <TextField
                            select
                            label={t('loan_type')}
                            value={selectedLoanType}
                            onChange={(e) => setSelectedLoanType(e.target.value)}
                            fullWidth
                            margin="normal"
                        >
                            {loanTypes.map((loan) => (
                                <MenuItem key={loan.value} value={loan.value}>
                                    {t(loan.type)}
                                </MenuItem>
                            ))}
                        </TextField>
                        {currentLoanType && (
                            <Typography variant="body2" color="textSecondary">
                                {t('interest_rate_range')}: {currentLoanType.minInterest}% - {currentLoanType.maxInterest}% {t('max_percentage')}: {(currentLoanType.maxPercentage * 100).toFixed(2)}% {t('max_years')}: {currentLoanType.maxYears}
                            </Typography>
                        )}
                        <TextField
                            label={t('property_value')}
                            type="text"
                            value={propertyValue}
                            onChange={handlePropertyValueChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label={t('selected_years')}
                            type="text"
                            value={selectedTime}
                            onChange={handleSelectedYearsChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label={t('interest_rate')}
                            type="text"
                            value={selectedInterest}
                            onChange={handleInterestRateChange}
                            fullWidth
                            margin="normal"
                        />
                        <Box display="flex" justifyContent="center" sx={{ marginTop: '1rem' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCalculateLoan}
                                disabled={isCalculateLoanDisabled}
                            >
                                {t('calculate_loan')}
                            </Button>
                        </Box>
                        <Box display="flex" justifyContent="center" sx={{ marginTop: '1rem' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleCalculateTotalCost}
                                disabled={isCalculateTotalCostDisabled}
                            >
                                {t('calculate_total_cost')}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ marginTop: '64px' }} // Adjust this value based on your navbar height
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="error">
                    {error}
                </Alert>
            </Snackbar>

            <MinimalistDialog
                open={openLoanDialog}
                onClose={() => setOpenLoanDialog(false)}
                title={t('loan_calculation_results')}
                content={
                    calculationResult && (
                        <Box>
                            <Typography variant="h6">{t('loan_max_amount')}: ${calculationResult.loanAmount.toFixed(2)}</Typography>
                            <Typography variant="h6">{t('monthly_fee')}: ${calculationResult.monthlyFee.toFixed(2)}</Typography>
                            <Typography variant="h6">{t('annual_interest')}: {calculationResult.annualInterest.toFixed(2)}%</Typography>
                            <Typography variant="h6">{t('monthly_interest')}: {calculationResult.monthlyInterest.toFixed(4)}%</Typography>
                            <Typography variant="h6">{t('months')}: {calculationResult.months}</Typography>
                        </Box>
                    )
                }
                actions={
                    <Button onClick={() => setOpenLoanDialog(false)} sx={{ color: '#4caf50' }}>
                        {t('close')}
                    </Button>
                }
            />

            <MinimalistDialog
                open={openTotalCostDialog}
                onClose={() => setOpenTotalCostDialog(false)}
                title={t('total_cost_calculation_results')}
                content={
                    totalCostResult && (
                        <Box>
                            <Typography variant="h6">{t('monthly_cost')}: ${totalCostResult.monthlyCost.toFixed(2)}</Typography>
                            <Typography variant="h6">{t('admin_fee')}: ${totalCostResult.adminFee.toFixed(2)}</Typography>
                            <Typography variant="h6">{t('relief_insurance')}: ${totalCostResult.reliefInsurance.toFixed(2)}</Typography>
                            <Typography variant="h6">{t('fire_insurance')}: ${totalCostResult.fireInsurance.toFixed(2)}</Typography>
                            <Typography variant="h6">{t('total_cost')}: ${totalCostResult.totalCost.toFixed(2)}</Typography>
                        </Box>
                    )
                }
                actions={
                    <Button onClick={() => setOpenTotalCostDialog(false)} sx={{ color: '#4caf50' }}>
                        {t('close')}
                    </Button>
                }
            />
        </Box>
    );
};

export default Simulation;