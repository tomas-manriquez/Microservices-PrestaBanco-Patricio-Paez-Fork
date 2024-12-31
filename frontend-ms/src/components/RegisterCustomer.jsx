import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import MuiCard from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import customerService from "../services/customer.service.js";
import { useTranslation } from 'react-i18next';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '600px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
}));

const RegisterCustomer = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [dadSurname, setDadSurname] = React.useState('');
    const [motherSurname, setMotherSurname] = React.useState('');
    const [age, setAge] = React.useState('');
    const [isValid, setIsValid] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('error');
    const { t } = useTranslation();

    const validateInputs = () => {
        if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setSnackbarMessage('Please enter a valid email address.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }

        if (!password || password.length < 6) {
            setSnackbarMessage('Password must be at least 6 characters long.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isValid = validateInputs();
        if (!isValid) {
            return;
        }

        const customer = {
            email,
            password,
            name,
            firstName: dadSurname,
            lastName: motherSurname,
            age,
        };

        customerService
            .register(customer)
            .then((response) => {
                setSnackbarMessage('Account successfully created! Please complete your data in your profile.');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            })
            .catch((error) => {
                setSnackbarMessage('There was an error creating the account.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const handleTextChange = (setter) => (event) => {
        const value = event.target.value;
        if (/^[a-zA-Z]*$/.test(value)) {
            setter(value);
        }
    };

    React.useEffect(() => {
        setIsValid(email && password && name && dadSurname && motherSurname && age);
    }, [email, password, name, dadSurname, motherSurname, age]);

    return (
        <SignInContainer sx={{ backgroundColor: '#c5c1c1' }}>
            <Card variant="outlined">
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', textAlign: 'center' }}
                >
                    {t("create_account")}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <FormLabel htmlFor="email">{t("email")}</FormLabel>
                            <TextField
                                id="email"
                                type="email"
                                name="email"
                                placeholder={t("email_example")}
                                autoComplete="email"
                                required
                                variant="outlined"
                                helperText={t("enter_valid_email")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <FormLabel htmlFor="password">{t("password")}</FormLabel>
                            <TextField
                                name="password"
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                                variant="outlined"
                                helperText={t("enter_password")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <FormLabel htmlFor="name">{t("name")}</FormLabel>
                            <TextField
                                name="name"
                                id="name"
                                placeholder="John"
                                required
                                variant="outlined"
                                helperText={t("enter_name")}
                                value={name}
                                onChange={handleTextChange(setName)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <FormLabel htmlFor="dadSurname">{t("first_name")}</FormLabel>
                            <TextField
                                name="dadSurname"
                                id="dadSurname"
                                placeholder="Kennedy"
                                required
                                variant="outlined"
                                helperText={t("enter_first_name")}
                                value={dadSurname}
                                onChange={handleTextChange(setDadSurname)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <FormLabel htmlFor="motherSurname">{t("last_name")}</FormLabel>
                            <TextField
                                name="motherSurname"
                                id="motherSurname"
                                placeholder="Lennon"
                                required
                                variant="outlined"
                                helperText={t("enter_last_name")}
                                value={motherSurname}
                                onChange={handleTextChange(setMotherSurname)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <FormLabel htmlFor="age">{t("age")}</FormLabel>
                            <TextField
                                name="age"
                                id="age"
                                select
                                required
                                variant="outlined"
                                helperText={t("select_age")}
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            >
                                {[...Array(83).keys()].map(i => (
                                    <MenuItem key={i + 18} value={i + 18}>
                                        {i + 18}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ marginTop: 2 }}
                    disabled={!isValid}
                >
                    {t("register")}
                </Button>
            </Card>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </SignInContainer>
    );
};

export default RegisterCustomer;