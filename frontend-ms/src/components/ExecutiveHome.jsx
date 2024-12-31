import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ExecutiveHome = () => {
    const { t } = useTranslation();

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
                {t('welcome_message_executive')}
            </Typography>
            <Typography
                variant="body1"
                align="center"
                paragraph
                color="textSecondary"
                maxWidth="700px"
            >
                {t('intro_message_executive')}
            </Typography>
            <Typography
                variant="body1"
                align="center"
                paragraph
                color="textSecondary"
                maxWidth="700px"
            >
                {t('support_message_executive')}
            </Typography>
        </Box>
    );
};

export default ExecutiveHome;