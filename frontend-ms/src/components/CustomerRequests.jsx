import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import RequestService from "../services/request.service.js";
import LoanService from "../services/loan.service.js";

const CustomerRequests = () => {
    const [userInfo, setUserInfo] = useState({ requests: [] });
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [files, setFiles] = useState({});

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
            case 4: return "Cancelled by customer";
            case 5: return "Delivering loan";
            default: return "Unknown";
        }
    };

    const handleCancelRequest = (requestId) => {
        const request = { id: requestId, status: 4 };
        RequestService
            .update(request)
            .then(() => {
                alert(`Request with ID: ${requestId} cancelled successfully`);
                setUserInfo(prevState => ({
                    ...prevState,
                    requests: prevState.requests.map(req => req.request.id === requestId ? { ...req, request: { ...req.request, status: 4 } } : req)
                }));
            })
            .catch(() => {
                alert(`Request couldn't be cancelled`);
            });
    };

    const handleOpenDialog = (request) => {
        setSelectedRequest(request);
        setFiles({});
        setOpenDialog(true);
    };

    const handleFileChange = (event, key) => {
        const file = event.target.files[0];
        setFiles((prev) => ({ ...prev, [key]: file }));
    };

    const handleUpdateFiles = () => {
        const formData = new FormData();
        Object.keys(files).forEach((key) => {
            formData.append(key, files[key]);
        });

        LoanService.updateFiles(selectedRequest.loan.id, formData)
            .then(() => {
                alert('Files updated successfully');
                setOpenDialog(false);
            })
            .catch((error) => {
                console.error('Error updating files:', error);
                alert('Failed to update files');
            });
    };

    const requiredDocuments = {
        1: ['incomeDocument', 'appraisalCertificate', 'historicalCredit'],
        2: ['incomeDocument', 'appraisalCertificate', 'historicalCredit', 'firstHomeDeed'],
        3: ['businessFinancialState', 'incomeDocument', 'appraisalCertificate', 'businessPlan'],
        4: ['incomeDocument', 'remodelingBudget', 'appraisalCertificate'],
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
                        <Box key={request.request.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                            <Box>
                                <Typography variant="subtitle1">
                                    Loan Type: {getLoanType(request.loan.selectedLoan)}
                                </Typography>
                                <Typography variant="body2">
                                    Status: {getStatusText(request.request.status)}
                                </Typography>
                            </Box>
                            <Box>
                                {(request.request.status === 2 || request.request.status === 3) && (
                                    <>
                                        <Button variant="contained" color="secondary" onClick={() => handleCancelRequest(request.request.id)}>
                                            Cancel request
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={() => handleOpenDialog(request)} style={{ marginLeft: 10 }}>
                                            Update Request
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Stack>
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Update Files</DialogTitle>
                <DialogContent>
                    {selectedRequest && requiredDocuments[selectedRequest.loan.selectedLoan]?.map((docKey) => (
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleUpdateFiles} color="primary">Update</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CustomerRequests;