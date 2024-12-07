import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    MenuItem,
    Typography,
    Grid,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import LoanService from '../services/loan.service';
import RequestService from '../services/request.service.js';

const Loans = ({ loanTypes = [
    { type: 'First House', minInterest: 3.5, maxInterest: 5, maxPercentage: 0.8, maxYears: 30 },
    { type: 'Second House', minInterest: 4, maxInterest: 6, maxPercentage: 0.7, maxYears: 20 },
    { type: 'Commercial Properties', minInterest: 5, maxInterest: 7, maxPercentage: 0.6, maxYears: 25 },
    { type: 'Remodeling', minInterest: 4.5, maxInterest: 6, maxPercentage: 0.5, maxYears: 15 }
] }) => {
    const [selectedLoanType, setSelectedLoanType] = useState('');
    const [propertyValue, setPropertyValue] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [selectedInterest, setSelectedInterest] = useState('');
    const [calculationResult, setCalculationResult] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    const currentLoanType = loanTypes.find((loan) => loan.type === selectedLoanType);

    const handleCalculateLoan = () => {
        const loanData = {
            loanType: selectedLoanType,
            propertyValue: propertyValue,
            years: selectedTime,
            interestRate: selectedInterest,
        };

        LoanService.calculateLoan(loanData)
            .then((data) => {
                setCalculationResult(data);
                setOpenDialog(true);
            })
            .catch((error) => {
                alert('Error calculating loan');
            });
    };


    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <div style={{ width: '500px' }}>
                <Typography variant="h6" align="center">Request a Loan</Typography>

                {/* Campos para seleccionar tipo de préstamo y valores */}
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

                {/* Botón para calcular préstamo */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCalculateLoan}
                    disabled={isButtonDisabled}
                >
                    Calculate Loan
                </Button>

                {/* Diálogo para mostrar resultados */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Loan Calculation Result</DialogTitle>
                    <DialogContent>
                        {calculationResult ? (
                            <>
                                <Typography>Monthly Fee: {calculationResult.monthlyFee}</Typography>
                                <Typography>Total Interest: {calculationResult.totalInterest}</Typography>
                                <Typography>Total Payment: {calculationResult.totalPayment}</Typography>
                            </>
                        ) : (
                            <Typography>Loading...</Typography>
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

export default Loans;
