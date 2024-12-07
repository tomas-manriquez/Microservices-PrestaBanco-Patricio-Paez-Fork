import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography, Stack, Button } from "@mui/material";
import RequestService from "../services/request.service.js";

const ManagementExecutive = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        RequestService
            .list()
            .then(response => {
                setRequests(response.data);
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
            case 2: return "Evaluation by executive";
            case 3: return "Accepted";
            case 4: return "Eliminated by customer";
            case 5: return "Delivering loan";
            default: return "Unknown";
        }
    };

    const handleChangeStatus = (requestId, newStatus) => {
        const request = {
            idRequest: requestId,
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

    return (
        <Box sx={{ flexGrow: 1, padding: 3, paddingTop: '70px'}}>
            <Typography variant="h5" component="div" gutterBottom>
                Customer Requests Management
            </Typography>

            {requests.length === 0 ? (
                <Typography variant="body1">No requests available</Typography>
            ) : (
                <Stack spacing={2}>
                    {requests.map(request => (
                        <Box key={request.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                            <Box>
                                <Typography variant="body2">
                                    Loan Type: {getLoanType(request.loan.selectedLoan)}
                                </Typography>
                                <Typography variant="body2">
                                    Status: {getStatusText(request.status)}
                                </Typography>
                                <Typography variant="body2">
                                    Years: {request.loan.selectedYears}, Amount: ${request.loan.selectedAmount}, Property Value: ${request.loan.propertyValue}
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
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default ManagementExecutive;
