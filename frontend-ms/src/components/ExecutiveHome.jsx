import React from 'react';
import { Box, Typography } from '@mui/material';

const ExecutiveHome = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            px={3}
            bgcolor="#e3f2fd"
        >
            <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                align="center"
                color="primary"
            >
                Welcome to PrestaBanco's Executive Portal
            </Typography>
            <Typography
                variant="body1"
                align="center"
                paragraph
                color="textSecondary"
                maxWidth="700px"
            >
                As an executive at PrestaBanco, you have the tools to efficiently manage and review customer loan requests.
                You can view, approve, reject, and track the progress of loan applications in real time.
            </Typography>
            <Typography
                variant="body1"
                align="center"
                paragraph
                color="textSecondary"
                maxWidth="700px"
            >
                Ensure that customers receive the support they need and help them move forward with their financial goals.
                You are at the heart of PrestaBanco's decision-making process.
            </Typography>
        </Box>
    );
};

export default ExecutiveHome;
