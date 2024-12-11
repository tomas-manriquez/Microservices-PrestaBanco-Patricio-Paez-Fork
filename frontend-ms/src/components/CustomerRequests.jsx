import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography, Stack, Button } from "@mui/material";
import RequestService from "../services/request.service.js";
import CustomerService from "../services/customer.service.js";

const CustomerRequests = () => {
    const [userInfo, setUserInfo] = useState({
        requests: []
    });

    useEffect(() => {
        const userId = localStorage.getItem('id');
        RequestService
            .listbyuser(userId)
            .then(response => {
                setUserInfo({ requests: response.data });
            })
            .catch(error => console.error("Error loading the requests:", error));
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
            case 4: return "Eliminated by customer";
            case 5: return "Delivering loan";
            default: return "Unknown";
        }
    };

    const handleCancelRequest = (requestId) => {
        const request = {
            idRequest: requestId,
            status: 4,
        };
        RequestService
            .update(request)
            .then((response) => {
                alert(`Cancelling request with ID: ${requestId}`);
            })
            .catch((error) => {
                alert(`Request couldn't be cancelled`);
            });
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Typography variant="h5" component="div" gutterBottom>
                Your requests
            </Typography>

            {userInfo.requests.length === 0 ? (
                <Typography variant="body1">No requests in process</Typography>
            ) : (
                <Stack spacing={2}>
                    {userInfo.requests.map(request => (
                        <Box key={request.request.idRequest} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                            <Box>
                                <Typography variant="subtitle1">
                                    Loan Type: {getLoanType(request.loan.loanType)} {/* Accede a loan.loanType */}
                                </Typography>
                                <Typography variant="body2">
                                    Status: {getStatusText(request.request.status)} {/* Accede a request.status */}
                                </Typography>
                            </Box>
                            {(request.request.status === 2 || request.request.status === 3) && (
                                <Button variant="contained" color="secondary" onClick={() => handleCancelRequest(request.request.idRequest)}>
                                    Cancel request
                                </Button>
                            )}
                        </Box>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default CustomerRequests;
