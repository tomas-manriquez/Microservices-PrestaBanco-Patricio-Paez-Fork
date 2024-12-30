import React, { useEffect, useState } from 'react';
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
    Snackbar,
    Alert,
    Paper,
} from '@mui/material';
import LoanService from '../services/loan.service';
import RequestService from '../services/request.service';

const Loans = ({ loanTypes = [
    { type: 'First House', value: 1 },
    { type: 'Second House', value: 2 },
    { type: 'Commercial Properties', value: 3 },
    { type: 'Remodeling', value: 4 },
] }) => {
    const [selectedLoanType, setSelectedLoanType] = useState('');
    const [propertyValue, setPropertyValue] = useState('');
    const [selectedYears, setSelectedYears] = useState('');
    const [selectedInterest, setSelectedInterest] = useState('');
    const [files, setFiles] = useState({});
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [calculatedLoan, setCalculatedLoan] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [loanTypeDetails, setLoanTypeDetails] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [yearsError, setYearsError] = useState(false);
    const [interestError, setInterestError] = useState(false);

    useEffect(() => {
        setIsButtonDisabled(
            !selectedLoanType || !propertyValue || !selectedYears || !selectedInterest
        );
    }, [selectedLoanType, propertyValue, selectedYears, selectedInterest]);

    useEffect(() => {
        const loanTypeDetails = {
            1: { minInterest: 3.5, maxInterest: 5, maxYears: 30 },
            2: { minInterest: 4, maxInterest: 6, maxYears: 20 },
            3: { minInterest: 5, maxInterest: 7, maxYears: 25 },
            4: { minInterest: 4.5, maxInterest: 6, maxYears: 15 },
        };
        setLoanTypeDetails(loanTypeDetails);
    }, []);

    const handleFileChange = (event, key) => {
        const file = event.target.files[0];
        setFiles((prev) => ({ ...prev, [key]: file }));
    };

    const handleCalculate = async () => {
        const loanData = {
            loanType: selectedLoanType,
            propertyValue: parseFloat(propertyValue),
            years: parseInt(selectedYears, 10),
            interestRate: parseFloat(selectedInterest)
        };

        const { minInterest, maxInterest, maxYears } = loanTypeDetails[selectedLoanType];

        if (loanData.years > maxYears) {
            setSnackbarMessage(`Years exceed the maximum allowed years of ${maxYears}`);
            setSnackbarOpen(true);
            setYearsError(true);
            return;
        } else {
            setYearsError(false);
        }

        if (loanData.interestRate < minInterest || loanData.interestRate > maxInterest) {
            setSnackbarMessage(`Interest rate must be between ${minInterest}% and ${maxInterest}%`);
            setSnackbarOpen(true);
            setInterestError(true);
            return;
        } else {
            setInterestError(false);
        }

        try {
            const response = await LoanService.calculateLoan(loanData);
            setCalculatedLoan(response);
            setOpenConfirmDialog(true);
        } catch (error) {
            console.error('Error calculating loan:', error);
            alert('Failed to calculate loan. Please check your inputs.');
        }
    };

    const handleConfirmSubmit = async () => {
        setOpenConfirmDialog(false);
        const idUser = localStorage.getItem('id'); // Corrected method
        const loanData = {
            userId: parseInt(idUser, 10),
            selectedLoan: parseInt(selectedLoanType, 10),
            selectedYears: parseInt(selectedYears, 10),
            selectedInterest: parseFloat(selectedInterest),
            propertyValue: parseFloat(propertyValue),
        };

        const formData = new FormData();
        formData.append('loanData', JSON.stringify(loanData));

        Object.keys(files).forEach((key) => {
            formData.append(key, files[key]);
        });

        try {
            const loanResponse = await LoanService.save(formData);
            const idLoan = loanResponse.data.id;
            await RequestService.save({ idLoan, idUser: idUser, status: 2 });
            setOpenDialog(true);
        } catch (error) {
            console.error('Error submitting loan request:', error);
            alert('There was an error submitting your loan request.');
        }
    };

    const requiredDocuments = {
        1: ['incomeDocument', 'appraisalCertificate', 'historicalCredit'],
        2: ['incomeDocument', 'appraisalCertificate', 'historicalCredit', 'firstHomeDeed'],
        3: ['businessFinancialState', 'incomeDocument', 'appraisalCertificate', 'businessPlan'],
        4: ['incomeDocument', 'remodelingBudget', 'appraisalCertificate'],
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ backgroundColor: '#f5f5f5', padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, width: '100%' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Request a Loan
                </Typography>
                <TextField
                    select
                    label="Loan Type"
                    value={selectedLoanType}
                    onChange={(e) => setSelectedLoanType(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                >
                    {loanTypes.map((loan) => (
                        <MenuItem key={loan.value} value={loan.value}>
                            {loan.type}
                        </MenuItem>
                    ))}
                </TextField>
                {selectedLoanType && (
                    <Typography variant="body2" color="textSecondary">
                        Min Interest: {loanTypeDetails[selectedLoanType]?.minInterest}%, Max Interest: {loanTypeDetails[selectedLoanType]?.maxInterest}%, Max Years: {loanTypeDetails[selectedLoanType]?.maxYears}
                    </Typography>
                )}
                <TextField
                    label="Property Value"
                    type="number"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label="Selected Years"
                    type="number"
                    value={selectedYears}
                    onChange={(e) => setSelectedYears(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={yearsError}
                    helperText={yearsError ? `Max years: ${loanTypeDetails[selectedLoanType]?.maxYears}` : ''}
                />
                <TextField
                    label="Interest Rate"
                    type="number"
                    value={selectedInterest}
                    onChange={(e) => setSelectedInterest(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={interestError}
                    helperText={interestError ? `Interest rate must be between ${loanTypeDetails[selectedLoanType]?.minInterest}% and ${loanTypeDetails[selectedLoanType]?.maxInterest}%` : ''}
                />
                {selectedLoanType &&
                    requiredDocuments[selectedLoanType]?.map((docKey) => (
                        <div key={docKey} style={{ marginTop: '16px' }}>
                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                                style={{ marginTop: '8px' }}
                            >
                                Upload {docKey.replace(/([A-Z])/g, ' $1')}
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => handleFileChange(e, docKey)}
                                />
                            </Button>
                        </div>
                    ))}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCalculate}
                    disabled={isButtonDisabled}
                    fullWidth
                    style={{ marginTop: '20px' }}
                >
                    Calculate Loan
                </Button>
                <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                    <DialogTitle>Loan Calculation</DialogTitle>
                    <DialogContent>
                        {calculatedLoan && (
                            <>
                                <Typography>Loan Amount: ${calculatedLoan.loanAmount.toFixed(2)}</Typography>
                                <Typography>Monthly Fee: ${calculatedLoan.monthlyFee.toFixed(2)}</Typography>
                                <Typography>Annual Interest Rate: {calculatedLoan.annualInterest}%</Typography>
                                <Typography>Duration: {calculatedLoan.months} months</Typography>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
                        <Button onClick={handleConfirmSubmit} color="primary">
                            Confirm and Submit
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Loan Request Submitted</DialogTitle>
                    <DialogContent>
                        <Typography>Your loan request has been submitted successfully!</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                    <Alert onClose={() => setSnackbarOpen(false)} severity="error">
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
};

export default Loans;