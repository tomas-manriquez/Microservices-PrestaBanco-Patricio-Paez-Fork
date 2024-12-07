import React from 'react';
import { Box, Typography } from '@mui/material';

const CustomerHome = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            px={3}
            bgcolor="#f4f4f9"
        >
            <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                align="center"
                color="primary"
            >
                Welcome to PrestaBanco's Customer Portal
            </Typography>
            <Typography
                variant="body1"
                align="center"
                paragraph
                color="textSecondary"
                maxWidth="600px"
            >
                At PrestaBanco, we empower you to take control of your financial future.
                Easily apply for personalized loan options, track the status of your requests,
                and access important details about your loans—all in one secure platform.
            </Typography>
            <Typography
                variant="body1"
                align="center"
                paragraph
                color="textSecondary"
                maxWidth="600px"
            >
                Whether you’re planning for a big investment or managing your finances, we’re here to support you every step of the way.
                Log in to explore your loan possibilities today!
            </Typography>
        </Box>
    );
};

export default CustomerHome;
