import React, { useState } from 'react';
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
} from '@mui/material';
import LoanService from '../services/loan.service';

const Simulation = ({ loanTypes = [
    { type: 'First House', minInterest: 3.5, maxInterest: 5, maxPercentage: 0.8, maxYears: 30 },
    { type: 'Second House', minInterest: 4, maxInterest: 6, maxPercentage: 0.7, maxYears: 20 },
    { type: 'Commercial Properties', minInterest: 5, maxInterest: 7, maxPercentage: 0.6, maxYears: 25 },
    { type: 'Remodeling', minInterest: 4.5, maxInterest: 6, maxPercentage: 0.5, maxYears: 15 }
] }) => {
    const [selectedLoanType, setSelectedLoanType] = useState('');
    const [propertyValue, setPropertyValue] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedInterest, setSelectedInterest] = useState('');
    const [insuranceRate, setInsuranceRate] = useState('');
    const [fixedMonthlyCost, setFixedMonthlyCost] = useState('');
    const [adminFeeRate, setAdminFeeRate] = useState('');
    const [calculationResult, setCalculationResult] = useState(null);
    const [totalCostResult, setTotalCostResult] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const currentLoanType = loanTypes.find((loan) => loan.type === selectedLoanType);

    const handleCalculateLoan = () => {
        const loanData = {
            propertyValue: parseFloat(propertyValue),
            years: parseInt(selectedTime),
            interestRate: parseFloat(selectedInterest),
            maxPercentage: currentLoanType?.maxPercentage || 0,
        };

        LoanService.simulate(loanData)
            .then((response) => {
                setCalculationResult(response.data);
                setOpenDialog(true);
            })
            .catch(() => {
                alert('Error calculating loan');
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

        LoanService.totalcost(totalCostData)
            .then((response) => {
                setTotalCostResult(response.data);
                setOpenDialog(true);
            })
            .catch(() => {
                alert('Error calculating total cost');
            });
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <div style={{ width: '500px' }}>
                <Typography variant="h6" align="center">Loan Simulator</Typography>

                <TextField
                    select
                    label="Loan Type"
                    value={selectedLoanType}
                    onChange={(e) => setSelectedLoanType(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    {loanTypes.map((loan) => (
                        <MenuItem key={loan.type} value={loan.type}>
                            {loan.type}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Property Value"
                    type="number"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Selected Time (years)"
                    type="number"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Interest Rate"
                    type="number"
                    value={selectedInterest}
                    onChange={(e) => setSelectedInterest(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Insurance Rate"
                    type="number"
                    value={insuranceRate}
                    onChange={(e) => setInsuranceRate(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Fixed Monthly Cost"
                    type="number"
                    value={fixedMonthlyCost}
                    onChange={(e) => setFixedMonthlyCost(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Admin Fee Rate"
                    type="number"
                    value={adminFeeRate}
                    onChange={(e) => setAdminFeeRate(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCalculateLoan}
                    fullWidth
                    style={{ marginTop: '1rem' }}
                >
                    Calculate Loan
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCalculateTotalCost}
                    fullWidth
                    style={{ marginTop: '1rem' }}
                >
                    Calculate Total Cost
                </Button>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Calculation Results</DialogTitle>
                    <DialogContent>
                        {calculationResult && (
                            <>
                                <Typography>Loan Amount: {calculationResult.loanAmount}</Typography>
                                <Typography>Monthly Fee: {calculationResult.monthlyFee}</Typography>
                                <Typography>Annual Interest: {calculationResult.annualInterest}%</Typography>
                            </>
                        )}
                        {totalCostResult && (
                            <>
                                <Typography>Total Cost: {totalCostResult.totalCost}</Typography>
                                <Typography>Insurance Cost: {totalCostResult.insuranceCost}</Typography>
                                <Typography>Fixed Costs: {totalCostResult.fixedCosts}</Typography>
                                <Typography>Admin Fee: {totalCostResult.adminFee}</Typography>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Box>
    );
};

export default Simulation;
