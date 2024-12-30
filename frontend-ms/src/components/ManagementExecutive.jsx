import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography, Stack, Button, Link, Paper } from "@mui/material";
import RequestService from "../services/request.service.js";
import LoanService from "../services/loan.service.js";

const ManagementExecutive = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await RequestService.list();
                const requestsWithLoanData = await Promise.all(response.data.map(async request => {
                    if (request.idLoan) {
                        try {
                            const loanResponse = await LoanService.get(request.idLoan);
                            return { ...request, loan: loanResponse.data };
                        } catch (error) {
                            console.error(`Error loading loan data for loan ${request.idLoan}:`, error);
                            return { ...request, loan: null };
                        }
                    }
                    return { ...request, loan: null };
                }));
                setRequests(requestsWithLoanData);
            } catch (error) {
                console.error("Error loading the requests:", error);
                setError("Failed to load requests");
            }
        };

        fetchRequests();
    }, []);

    const getLoanType = (selectedLoan) => {
        switch (selectedLoan) {
            case 1: return "First House";
            case 2: return "Second House";
            case 3: return "Business Properties";
            case 4: return "Remodeling";
            default: return "Unknown";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 1: return "Rejected";
            case 2: return "Evaluating by executive";
            case 3: return "Accepted";
            case 4: return "Cancelled by customer";
            case 5: return "Delivering loan";
            case 6: return "Delivered loan";
            default: return "Unknown";
        }
    };

    const handleChangeStatus = (requestId, newStatus) => {
        const request = {
            id: requestId,
            status: newStatus,
        };
        RequestService
            .update(request)
            .then(() => {
                alert(`Status changed to ${getStatusText(newStatus)}`);
                setRequests(prevRequests =>
                    prevRequests.map(req =>
                        req.id === requestId ? { ...req, status: newStatus } : req
                    )
                );
            })
            .catch((error) => {
                console.error(`Error updating status for request ${requestId}:`, error);
                alert("Failed to change request status");
            });
    };

    const renderFiles = (loan) => {
        const requiredDocuments = {
            1: ['incomeDocument', 'appraisalCertificate', 'historicalCredit'],
            2: ['incomeDocument', 'appraisalCertificate', 'historicalCredit', 'firstHomeDeed'],
            3: ['businessFinancialState', 'incomeDocument', 'appraisalCertificate', 'businessPlan'],
            4: ['incomeDocument', 'remodelingBudget', 'appraisalCertificate'],
        };

        const fileFields = requiredDocuments[loan.selectedLoan] || [];
        const missingFiles = fileFields.filter(file => !loan[file]);

        return (
            <Box>
                <Typography variant="body2">Files:</Typography>
                <ul>
                    {fileFields.map((file, index) => (
                        loan[file] ? (
                            <li key={index}>
                                <Link href={`data:application/octet-stream;base64,${loan[file]}`} target="_blank" rel="noopener">
                                    {file.replace(/([A-Z])/g, ' $1')}
                                </Link>
                            </li>
                        ) : (
                            <li key={index} style={{ color: 'red' }}>
                                {file.replace(/([A-Z])/g, ' $1')} (Missing)
                            </li>
                        )
                    ))}
                </ul>
                {missingFiles.length > 0 && (
                    <Typography variant="body2" color="error">
                        Missing files for this loan type.
                    </Typography>
                )}
            </Box>
        );
    };

    if (error) {
        return <Typography variant="body1" color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 3, paddingTop: '70px', backgroundColor: '#e3f2fd', minHeight: '100vh' }}>
            <Typography variant="h5" component="div" gutterBottom>
                Customer Requests Management
            </Typography>

            {requests.length === 0 ? (
                <Typography variant="body1">No requests available</Typography>
            ) : (
                <Stack spacing={2}>
                    {requests.map(request => (
                        <Paper key={request.id} sx={{ padding: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    {request.loan && (
                                        <>
                                            <Typography variant="body2">
                                                Loan Type: {getLoanType(request.loan.selectedLoan)}
                                            </Typography>
                                            <Typography variant="body2">
                                                Years: {request.loan.selectedYears}
                                            </Typography>
                                            <Typography variant="body2">
                                                Interest: {request.loan.selectedInterest}%
                                            </Typography>
                                            <Typography variant="body2">
                                                Property Value: ${request.loan.propertyValue}
                                            </Typography>
                                            {renderFiles(request.loan)}
                                        </>
                                    )}
                                    <Typography variant="body2">
                                        Status: {getStatusText(request.status)}
                                    </Typography>
                                </Box>
                                <Box>
                                    {request.status === 2 && (
                                        <>
                                            <Button variant="contained" color="primary" onClick={() => handleChangeStatus(request.id, 3)}>
                                                Accept
                                            </Button>
                                            <Button variant="contained" color="secondary" onClick={() => handleChangeStatus(request.id, 1)} style={{ marginLeft: 10 }}>
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {request.status === 3 && (
                                        <Button variant="contained" color="success" onClick={() => handleChangeStatus(request.id, 5)}>
                                            Deliver Loan
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default ManagementExecutive;