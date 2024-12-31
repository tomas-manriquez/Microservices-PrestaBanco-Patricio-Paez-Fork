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
import { useTranslation } from 'react-i18next';

const Loans = ({ loanTypes = [
    { type: 'loan_types.first_house', value: 1 },
    { type: 'loan_types.second_house', value: 2 },
    { type: 'loan_types.commercial_properties', value: 3 },
    { type: 'loan_types.remodeling', value: 4 },
] }) => {
    const [selectedLoanType, setSelectedLoanType] = useState('');
    const [propertyValue, setPropertyValue] = useState('');
    const [selectedYears, setSelectedYears] = useState('');
    const [selectedAmount, setSelectedAmount] = useState('');
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
    const [openWarningDialog, setOpenWarningDialog] = useState(false);
    const [missingFiles, setMissingFiles] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        setIsButtonDisabled(
            !selectedLoanType || !propertyValue || !selectedYears || !selectedInterest || !selectedAmount
        );
    }, [selectedLoanType, propertyValue, selectedYears, selectedInterest, selectedAmount]);

    useEffect(() => {
        const loanTypeDetails = {
            1: { minInterest: 3.5, maxInterest: 5, maxAmount: 0.8, maxYears: 30 },
            2: { minInterest: 4, maxInterest: 6, maxAmount: 0.7, maxYears: 20 },
            3: { minInterest: 5, maxInterest: 7, maxAmount: 0.6, maxYears: 25 },
            4: { minInterest: 4.5, maxInterest: 6, maxAmount: 0.5, maxYears: 15 },
        };
        setLoanTypeDetails(loanTypeDetails);
    }, []);

    const handleFileChange = (event, key) => {
        const file = event.target.files[0];
        setFiles((prev) => ({ ...prev, [key]: file }));
    };

    const formatNumber = (value) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handlePropertyValueChange = (e) => {
        const value = e.target.value.replace(/\./g, '');
        if (/^\d*$/.test(value)) {
            setPropertyValue(formatNumber(value));
        }
    };

    const handleSelectedAmountChange = (e) => {
        const value = e.target.value.replace(/\./g, '');
        if (/^\d*$/.test(value)) {
            setSelectedAmount(formatNumber(value));
        }
    };

    const handleSelectedYearsChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setSelectedYears(value);
        }
    };

    const handleInterestRateChange = (e) => {
        const value = e.target.value.replace(',', '.');
        if (/^\d*\.?\d*$/.test(value)) {
            setSelectedInterest(value);
        }
    };

    const handleCalculate = async () => {
        const loanData = {
            loanType: selectedLoanType,
            propertyValue: parseFloat(propertyValue.replace(/\./g, '')),
            years: parseInt(selectedYears, 10),
            interestRate: parseFloat(selectedInterest),
            selectedAmount: parseFloat(selectedAmount.replace(/\./g, ''))
        };

        const { minInterest, maxInterest, maxYears, maxAmount } = loanTypeDetails[selectedLoanType];

        if (loanData.years > maxYears) {
            setSnackbarMessage(`${t('max_years')}: ${maxYears}`);
            setSnackbarOpen(true);
            setYearsError(true);
            return;
        } else {
            setYearsError(false);
        }

        if (loanData.interestRate < minInterest || loanData.interestRate > maxInterest) {
            setSnackbarMessage(`${t('interest_rate')} ${minInterest}% - ${maxInterest}%`);
            setSnackbarOpen(true);
            setInterestError(true);
            return;
        } else {
            setInterestError(false);
        }

        if (loanData.selectedAmount > loanData.propertyValue * maxAmount) {
            setSnackbarMessage(`${t('selected_amount_exceeds')} ${maxAmount * 100}% ${t('of_property_value')}`);
            setSnackbarOpen(true);
            return;
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
        const requiredDocs = requiredDocuments[selectedLoanType] || [];
        const missingFiles = requiredDocs.filter(doc => !files[doc]);

        if (missingFiles.length > 0) {
            setMissingFiles(missingFiles);
            setOpenWarningDialog(true);
            return;
        }

        await submitLoanRequest();
    };

    const submitLoanRequest = async () => {
        setOpenConfirmDialog(false);
        const idUser = localStorage.getItem('id');
        const loanData = {
            userId: parseInt(idUser, 10),
            selectedLoan: parseInt(selectedLoanType, 10),
            selectedYears: parseInt(selectedYears, 10),
            selectedInterest: parseFloat(selectedInterest),
            propertyValue: parseFloat(propertyValue.replace(/\./g, '')),
            selectedAmount: parseFloat(selectedAmount.replace(/\./g, ''))
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

    const formatFileName = (fileName) => {
        return t(`files.${fileName.replace(/([A-Z])/g, '_$1').toLowerCase()}`);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        window.location.href = '/customer/profile/requests';
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ backgroundColor: '#c5c1c1', padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, width: '100%' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    {t('request_loan')}
                </Typography>
                <TextField
                    select
                    label={t('loan_type')}
                    value={selectedLoanType}
                    onChange={(e) => setSelectedLoanType(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                >
                    {loanTypes.map((loan) => (
                        <MenuItem key={loan.value} value={loan.value}>
                            {t(loan.type)}
                        </MenuItem>
                    ))}
                </TextField>
                {selectedLoanType && (
                    <Typography variant="body2" color="textSecondary">
                        {t('min_interest')}: {loanTypeDetails[selectedLoanType]?.minInterest}%, {t('max_interest')}: {loanTypeDetails[selectedLoanType]?.maxInterest}%, {t('max_years')}: {loanTypeDetails[selectedLoanType]?.maxYears},
                        <br />
                        {t('max_amount')}: {loanTypeDetails[selectedLoanType]?.maxAmount * 100}% {t('of_property_value')}
                    </Typography>
                )}
                <TextField
                    label={t('property_value')}
                    type="text"
                    value={propertyValue}
                    onChange={handlePropertyValueChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label={t('selected_amount')}
                    type="text"
                    value={selectedAmount}
                    onChange={handleSelectedAmountChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label={t('selected_years')}
                    type="text"
                    value={selectedYears}
                    onChange={handleSelectedYearsChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={yearsError}
                    helperText={yearsError ? `${t('max_years')}: ${loanTypeDetails[selectedLoanType]?.maxYears}` : ''}
                />
                <TextField
                    label={t('interest_rate')}
                    type="text"
                    value={selectedInterest}
                    onChange={handleInterestRateChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={interestError}
                    helperText={interestError ? `${t('interest_rate')} ${loanTypeDetails[selectedLoanType]?.minInterest}% - ${loanTypeDetails[selectedLoanType]?.maxInterest}%` : ''}
                />
                {selectedLoanType &&
                    requiredDocuments[selectedLoanType]?.map((docKey) => (
                        <div key={docKey} style={{ marginTop: '16px' }}>
                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                                sx={{
                                    marginTop: '8px',
                                    backgroundColor: files[docKey] ? '#4caf50' : '#1976d2', // Change color based on file presence
                                    '&:hover': {
                                        backgroundColor: files[docKey] ? '#388e3c' : '#115293', // Change hover color based on file presence
                                    },
                                }}
                            >
                                {t('upload')} {formatFileName(docKey)}
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
                    sx={{
                        marginTop: '20px',
                        backgroundColor: '#1976d2',
                        '&:hover': {
                            backgroundColor: '#115293',
                        },
                        padding: '10px 20px',
                        fontSize: '16px',
                    }}
                >
                    {t('calculate_loan')}
                </Button>
                <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                    <DialogTitle>{t('loan_calculation')}</DialogTitle>
                    <DialogContent>
                        {calculatedLoan && (
                            <>
                                <Typography>{t('loan_amount')}: ${calculatedLoan.loanAmount.toFixed(2)}</Typography>
                                <Typography>{t('monthly_fee')}: ${calculatedLoan.monthlyFee.toFixed(2)}</Typography>
                                <Typography>{t('annual_interest_rate')}: {calculatedLoan.annualInterest}%</Typography>
                                <Typography>{t('duration')}: {calculatedLoan.months} {t('months')}</Typography>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setOpenConfirmDialog(false)}
                            sx={{
                                color: '#f44336',
                            }}
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            onClick={handleConfirmSubmit}
                            sx={{
                                color: '#4caf50',
                            }}
                        >
                            {t('confirm_submit')}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{t('loan_request_submitted')}</DialogTitle>
                    <DialogContent>
                        <Typography>{t('loan_request_success')}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>{t('close')}</Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                    <Alert onClose={() => setSnackbarOpen(false)} severity="error">
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Paper>
            <Dialog open={openWarningDialog} onClose={() => setOpenWarningDialog(false)}>
                <DialogTitle>{t('missing_files')}</DialogTitle>
                <DialogContent>
                    <Typography>{t('upload_files')} {missingFiles.map(formatFileName).join(', ')}</Typography>
                    <Typography>{t('proceed_request')}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenWarningDialog(false)}
                            sx={{
                                color: '#f44336',
                            }}
                    >
                        {t('cancel')}
                    </Button>
                    <Button onClick={submitLoanRequest}
                            sx={{
                                color: '#4caf50',
                            }}
                    >
                        {t('proceed')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Loans;