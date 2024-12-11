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
import RequestService from '../services/request.service';

const Loans = ({ userId, loanTypes = [
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

    useEffect(() => {
        setIsButtonDisabled(
            !selectedLoanType || !propertyValue || !selectedYears || !selectedInterest
        );
    }, [selectedLoanType, propertyValue, selectedYears, selectedInterest]);

    const handleFileChange = (event, key) => {
        const file = event.target.files[0];
        setFiles((prev) => ({ ...prev, [key]: file }));
    };

    const handleCalculate = async () => {
        try {
            const response = await LoanService.calculateLoan(
                selectedLoanType,
                parseFloat(propertyValue),
                parseInt(selectedYears, 10),
                parseFloat(selectedInterest)
            );
            setCalculatedLoan(response.data);
            setOpenConfirmDialog(true);
        } catch (error) {
            console.error('Error calculating loan:', error);
            alert('Failed to calculate loan. Please check your inputs.');
        }
    };

    const handleConfirmSubmit = async () => {
        setOpenConfirmDialog(false);
        const loanData = {
            selectedLoan: parseInt(selectedLoanType, 10),
            selectedYears: parseInt(selectedYears, 10),
            selectedInterest: parseFloat(selectedInterest),
            propertyValue: parseFloat(propertyValue),
        };

        try {
            const loanResponse = await LoanService.save(loanData);
            const idLoan = loanResponse.data.id;

            await RequestService.save({ idLoan, idUser: userId, status: 2 });
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <div style={{ width: '500px' }}>
                <Typography variant="h6" align="center">
                    Request a Loan
                </Typography>
                <TextField
                    select
                    label="Loan Type"
                    value={selectedLoanType}
                    onChange={(e) => setSelectedLoanType(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    {loanTypes.map((loan) => (
                        <MenuItem key={loan.value} value={loan.type}>
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
                    label="Selected Years"
                    type="number"
                    value={selectedYears}
                    onChange={(e) => setSelectedYears(e.target.value)}
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
                {selectedLoanType &&
                    requiredDocuments[selectedLoanType]?.map((docKey) => (
                        <div key={docKey} style={{ marginTop: '16px' }}>
                            <Typography>{docKey.replace(/([A-Z])/g, ' $1')}</Typography>
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e, docKey)}
                            />
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
            </div>
        </Box>
    );
};

export default Loans;