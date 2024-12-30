import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import CustomerService from "../services/customer.service.js";
import { useNavigate } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    width: '100%',
    padding: theme.spacing(2),
}));

const validateInputs = () => {
    const email = document.getElementById('email').value;

    if (!email || !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return false;
    }

    return true;
};

const LoginCustomer = () => {
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('error');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isValid = validateInputs();
        if (!isValid) {
            setSnackbarMessage('Please enter a valid email address.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        const logindata = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        };

        CustomerService
            .login(logindata)
            .then((response) => {
                localStorage.setItem('token', 1);
                localStorage.setItem('id', response.data.userId);
                navigate('/customer/home');
                window.location.reload();
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    setSnackbarMessage('Incorrect email or password.');
                } else {
                    setSnackbarMessage('There was an error logging in.');
                }
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    return (
        <SignInContainer direction="column" justifyContent="space-between" sx={{ backgroundColor: '#c5c1c1' }}>
            <Card variant="outlined">
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', textAlign: 'center' }}
                >
                    Login
                </Typography>
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        placeholder="example@email.com"
                        autoComplete="email"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        sx={{ ariaLabel: 'email' }}
                    />
                </FormControl>
                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                    </Box>
                    <TextField
                        name="password"
                        placeholder="••••••••"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        sx={{ alignSelf: 'baseline' }}
                    />
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ margin: 'auto' }}
                >
                    Sign in
                </Button>
            </Card>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
                sx={{ mt: '70px' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </SignInContainer>
    );
};

export default LoginCustomer;