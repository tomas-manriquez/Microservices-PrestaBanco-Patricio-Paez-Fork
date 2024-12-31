import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    MenuItem,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
} from '@mui/material';
import SimulationService from '../services/simulation.service.js';
import { useTranslation } from 'react-i18next';

const Simulation = ({ loanTypes = [
    { type: 'loan_types.first_house', minInterest: 3.5, maxInterest: 5, maxPercentage: 0.8, maxYears: 30 },
    { type: 'loan_types.second_house', minInterest: 4, maxInterest: 6, maxPercentage: 0.7, maxYears: 20 },
    { type: 'loan_types.commercial_properties', minInterest: 5, maxInterest: 7, maxPercentage: 0.6, maxYears: 25 },
    { type: 'loan_types.remodeling', minInterest: 4.5, maxInterest: 6, maxPercentage: 0.5, maxYears: 15 }
] }) => {
    const { t } = useTranslation();
    const [selectedLoanType, setSelectedLoanType] = useState('');
    const [propertyValue, setPropertyValue] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedInterest, setSelectedInterest] = useState('');
    const [insuranceRate, setInsuranceRate] = useState('');
    const [fixedMonthlyCost, setFixedMonthlyCost] = useState('');
    const [adminFeeRate, setAdminFeeRate] = useState('');
    const [calculationResult, setCalculationResult] = useState(null);
    const [totalCostResult, setTotalCostResult] = useState(null);
    const [openLoanDialog, setOpenLoanDialog] = useState(false);
    const [openTotalCostDialog, setOpenTotalCostDialog] = useState(false);
    const [isCalculateLoanDisabled, setIsCalculateLoanDisabled] = useState(true);
    const [isCalculateTotalCostDisabled, setIsCalculateTotalCostDisabled] = useState(true);

    const currentLoanType = loanTypes.find((loan) => loan.type === selectedLoanType);

    useEffect(() => {
        setIsCalculateLoanDisabled(
            !selectedLoanType || !propertyValue || !selectedTime || !selectedInterest
        );
    }, [selectedLoanType, propertyValue, selectedTime, selectedInterest]);

    useEffect(() => {
        setIsCalculateTotalCostDisabled(
            !selectedLoanType || !propertyValue || !selectedTime || !selectedInterest || !insuranceRate || !fixedMonthlyCost || !adminFeeRate
        );
    }, [selectedLoanType, propertyValue, selectedTime, selectedInterest, insuranceRate, fixedMonthlyCost, adminFeeRate]);

    const handleCalculateLoan = () => {
        const loanData = {
            propertyValue: parseFloat(propertyValue),
            years: parseInt(selectedTime),
            interestRate: parseFloat(selectedInterest),
            maxPercentage: currentLoanType?.maxPercentage || 0,
        };

        SimulationService.simulate(loanData)
            .then((response) => {
                setCalculationResult(response.data);
                setOpenLoanDialog(true);
            })
            .catch(() => {
                alert(t('error_calculating_loan'));
            });
    };

    const handleCalculateTotalCost = () => {
        const totalCostData = {
            propertyValue: parseFloat(propertyValue),
            years: parseInt(selectedTime),
            interestRate: parseFloat(selectedInterest),
            maxPercentage: currentLoanType?.maxPercentage || 0,
            insuranceRate: parseFloat(insuranceRate),
            fixedMonthlyCost: parseFloat(fixedMonthlyCost),
            adminFeeRate: parseFloat(adminFeeRate),
        };

        SimulationService.totalcost(totalCostData)
            .then((response) => {
                setTotalCostResult(response.data);
                setOpenTotalCostDialog(true);
            })
            .catch(() => {
                alert(t('error_calculating_total_cost'));
            });
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ backgroundColor: '#c5c1c1', padding: 3 }}>
            <Box display="flex" flexDirection="row" justifyContent="space-between" sx={{ width: '100%', maxWidth: 1200 }}>
                <Paper elevation={3} sx={{ padding: 4, width: '48%' }}>
                    <Typography variant="h6" align="center">{t('simulation')}</Typography>
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
                                <MenuItem key={loan.type} value={loan.type}>
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
                            type="number"
                            value={propertyValue}
                            onChange={(e) => setPropertyValue(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label={t('selected_years')}
                            type="number"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label={t('interest_rate')}
                            type="number"
                            value={selectedInterest}
                            onChange={(e) => setSelectedInterest(e.target.value)}
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
                    </Box>
                </Paper>

                <Paper elevation={3} sx={{ padding: 4, width: '48%' }}>
                    <Typography variant="h6" align="center">{t('total_cost')}</Typography>
                    <Box component="form">
                        <TextField
                            label={t('insurance_rate')}
                            type="number"
                            value={insuranceRate}
                            onChange={(e) => setInsuranceRate(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label={t('fixed_monthly_cost')}
                            type="number"
                            value={fixedMonthlyCost}
                            onChange={(e) => setFixedMonthlyCost(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label={t('admin_fee_rate')}
                            type="number"
                            value={adminFeeRate}
                            onChange={(e) => setAdminFeeRate(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Box paddingTop={15} display="flex" justifyContent="center">
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

            <Dialog open={openLoanDialog} onClose={() => setOpenLoanDialog(false)}>
                <DialogTitle>{t('loan_calculation_results')}</DialogTitle>
                <DialogContent>
                    {calculationResult && (
                        <>
                            <Typography>{t('loan_amount')}: {calculationResult.loanAmount.toFixed(2)}</Typography>
                            <Typography>{t('monthly_fee')}: {calculationResult.monthlyFee.toFixed(2)}</Typography>
                            <Typography>{t('annual_interest')}: {calculationResult.annualInterest.toFixed(2)}%</Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLoanDialog(false)}>{t('close')}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openTotalCostDialog} onClose={() => setOpenTotalCostDialog(false)}>
                <DialogTitle>{t('total_cost_calculation_results')}</DialogTitle>
                <DialogContent>
                    {totalCostResult && (
                        <>
                            <Typography>{t('total_cost')}: {totalCostResult.totalCost.toFixed(2)}</Typography>
                            <Typography>{t('insurance_cost')}: {totalCostResult.insuranceCost.toFixed(2)}</Typography>
                            <Typography>{t('fixed_costs')}: {totalCostResult.fixedCosts.toFixed(2)}</Typography>
                            <Typography>{t('admin_fee')}: {totalCostResult.adminFee.toFixed(2)}</Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenTotalCostDialog(false)}>{t('close')}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Simulation;