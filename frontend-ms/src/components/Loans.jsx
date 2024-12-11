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
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        setIsButtonDisabled(
            !selectedLoanType || !propertyValue || !selectedYears || !selectedInterest
        );
    }, [selectedLoanType, propertyValue, selectedYears, selectedInterest]);

    const handleFileChange = (event, key) => {
        const file = event.target.files[0];
        setFiles((prev) => ({ ...prev, [key]: file }));
    };

    const handleSubmit = async () => {
        const loanData = {
            selectedLoan: parseInt(selectedLoanType, 10),
            selectedYears: parseInt(selectedYears, 10),
            selectedInterest: parseFloat(selectedInterest),
            propertyValue: parseFloat(propertyValue),
            idUser: userId,
        };

        const formData = new FormData();
        formData.append('loanData', new Blob([JSON.stringify(loanData)], { type: 'application/json' }));

        Object.keys(files).forEach((key) => {
            if (files[key]) {
                formData.append(key, files[key]);
            }
        });

        try {
            const response = await LoanService.save(formData);
            await RequestService.save({ idLoan: response.id, idUser: userId, status: 2 }); // Status 2: Evaluation
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
                        <MenuItem key={loan.value} value={loan.value}>
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
                    onClick={handleSubmit}
                    disabled={isButtonDisabled}
                    fullWidth
                    style={{ marginTop: '20px' }}
                >
                    Submit Request
                </Button>
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
