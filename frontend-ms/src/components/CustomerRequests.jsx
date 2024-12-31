import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import RequestService from "../services/request.service.js";
import LoanService from "../services/loan.service.js";
import { useTranslation } from 'react-i18next';

const CustomerRequests = () => {
    const { t } = useTranslation();
    const [userInfo, setUserInfo] = useState({ requests: [] });
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [files, setFiles] = useState({});
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [requestIdToCancel, setRequestIdToCancel] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [alertOpen, setAlertOpen] = useState(false);

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
            case 1: return t("first_house");
            case 2: return t("second_house");
            case 3: return t("business_properties");
            case 4: return t("remodeling");
            default: return t("unknown");
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 1: return t("rejected");
            case 2: return t("evaluating_by_executive");
            case 3: return t("accepted");
            case 4: return t("cancelled_by_customer");
            case 5: return t("delivering_loan");
            default: return t("unknown");
        }
    };

    const handleCancelRequest = (requestId) => {
        setRequestIdToCancel(requestId);
        setOpenCancelDialog(true);
    };

    const confirmCancelRequest = () => {
        const request = { id: requestIdToCancel, status: 4 };
        RequestService
            .update(request)
            .then(() => {
                setAlertMessage(t("request_cancelled_successfully", { requestId: requestIdToCancel }));
                setAlertSeverity('success');
                setAlertOpen(true);
                setUserInfo(prevState => ({
                    ...prevState,
                    requests: prevState.requests.map(req => req.request.id === requestIdToCancel ? { ...req, request: { ...req.request, status: 4 } } : req)
                }));
                setOpenCancelDialog(false);
            })
            .catch(() => {
                setAlertMessage(t("request_could_not_be_cancelled"));
                setAlertSeverity('error');
                setAlertOpen(true);
                setOpenCancelDialog(false);
            });
    };

    const handleDeleteRequest = (requestId) => {
        RequestService
            .remove(requestId)
            .then(() => {
                setAlertMessage(t("request_deleted_successfully", { requestId }));
                setAlertSeverity('success');
                setAlertOpen(true);
                setUserInfo(prevState => ({
                    ...prevState,
                    requests: prevState.requests.filter(req => req.request.id !== requestId)
                }));
            })
            .catch(() => {
                setAlertMessage(t("request_could_not_be_deleted"));
                setAlertSeverity('error');
                setAlertOpen(true);
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
                setAlertMessage(t("files_updated_successfully"));
                setAlertSeverity('success');
                setAlertOpen(true);
                setOpenDialog(false);
            })
            .catch((error) => {
                console.error('Error updating files:', error);
                setAlertMessage(t("failed_to_update_files"));
                setAlertSeverity('error');
                setAlertOpen(true);
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
                {t("your_requests")}
            </Typography>

            {userInfo.requests.length === 0 ? (
                <Typography variant="body1">{t("no_requests_in_process")}</Typography>
            ) : (
                <Stack spacing={2}>
                    {userInfo.requests.map(request => (
                        <Box key={request.request.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                            <Box>
                                <Typography variant="subtitle1">
                                    {t("loan_type")}: {getLoanType(request.loan.selectedLoan)}
                                </Typography>
                                <Typography variant="body2">
                                    {t("status")}: {getStatusText(request.request.status)}
                                </Typography>
                            </Box>
                            <Box>
                                {(request.request.status === 2 || request.request.status === 3) && (
                                    <>
                                        <Button variant="contained" color="secondary" onClick={() => handleCancelRequest(request.request.id)}>
                                            {t("cancel_request")}
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={() => handleOpenDialog(request)} style={{ marginLeft: 10 }}>
                                            {t("update_request")}
                                        </Button>
                                    </>
                                )}
                                {(request.request.status === 1 || request.request.status === 4) && (
                                    <Button variant="contained" color="error" onClick={() => handleDeleteRequest(request.request.id)} style={{ marginLeft: 10 }}>
                                        {t("delete_request")}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Stack>
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{t("update_files")}</DialogTitle>
                <DialogContent>
                    {selectedRequest && requiredDocuments[selectedRequest.loan.selectedLoan]?.map((docKey) => (
                        <div key={docKey} style={{ marginTop: '16px' }}>
                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                                style={{ marginTop: '8px' }}
                            >
                                {t("upload")} {t(`files.${docKey.replace(/([A-Z])/g, '_$1').toLowerCase()}`)}
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
                    <Button onClick={() => setOpenDialog(false)}>{t("cancel")}</Button>
                    <Button onClick={handleUpdateFiles} color="primary">{t("update")}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
                <DialogTitle>{t("confirm_cancel_request")}</DialogTitle>
                <DialogContent>
                    <Typography>{t("are_you_sure_cancel_request")}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{ color: 'red' }}
                        onClick={() => setOpenCancelDialog(false)}>{t("no")}</Button>
                    <Button onClick={confirmCancelRequest} color="primary">{t("yes")}</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
                <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CustomerRequests;