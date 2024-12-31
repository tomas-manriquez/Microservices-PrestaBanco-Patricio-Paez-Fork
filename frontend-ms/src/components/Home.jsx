import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();

    return (
        <Container maxWidth="lg">
            <Box display="flex" flexDirection="column" alignItems="center" py={5}>
                <Typography variant="h3" fontWeight="bold" gutterBottom align="center" color="primary">
                    {t('welcome_message')}
                </Typography>
                <Typography variant="body1" align="center" paragraph color="textSecondary" maxWidth="800px">
                    {t('intro_message')}
                </Typography>
            </Box>
            <Box py={5}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                    {t('our_services')}
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {t('life_insurance')}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {t('life_insurance_desc')}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {t('health_insurance')}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {t('health_insurance_desc')}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {t('property_insurance')}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {t('property_insurance_desc')}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <Box py={5}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                    {t('recent_articles')}
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {t('understanding_life_insurance')}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {t('understanding_life_insurance_desc')}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {t('choosing_health_insurance')}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {t('choosing_health_insurance_desc')}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Home;