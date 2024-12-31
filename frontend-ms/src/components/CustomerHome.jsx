import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const CustomerHome = () => {
    const { t } = useTranslation();

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            px={3}
            sx={{ backgroundColor: '#c5c1c1', padding: 3 }}
        >
            <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                align="center"
                color="primary"
            >
                {t('welcome_message_customer')}
            </Typography>
            <Typography
                variant="body1"
                align="center"
                paragraph
                color="textSecondary"
                maxWidth="600px"
            >
                {t('intro_message_customer')}
            </Typography>
            <Typography
                variant="body1"
                align="center"
                paragraph
                color="textSecondary"
                maxWidth="600px"
            >
                {t('support_message_customer')}
            </Typography>
        </Box>
    );
};

export default CustomerHome;