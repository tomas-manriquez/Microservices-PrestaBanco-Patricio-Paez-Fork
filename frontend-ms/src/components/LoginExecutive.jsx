import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ExecutiveService from "../services/executive.service.js";
import {useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';

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
    position: 'absolute',
    top: '0%',
    width: '100%',
    padding: theme.spacing(2),
}));

const validateInputs = () => {
    const email = document.getElementById('email').value;

    if (!email || !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    return true;
};

const LoginExecutive = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isValid = validateInputs();
        if (!isValid) {
            console.log("Validation failed");
            return;
        }

        const logindata = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        };

        ExecutiveService
            .login(logindata)
            .then((response) => {
                console.log("Customer logged in.");
                localStorage.setItem('tokenExe', response.data.token);
                navigate('/executive/home');
                window.location.reload();
            })
            .catch((error) => {
                console.log("There was an error logging in account.", error);
            });
    };

    return (
        <SignInContainer direction="column" justifyContent="space-between" sx={{backgroundColor:"#e3f2fd" }}>
            <Card variant="outlined">
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', textAlign: 'center',}}
                >
                    {t('login')}
                </Typography>
                <FormControl>
                    <FormLabel htmlFor="email">{t('email')}</FormLabel>
                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        placeholder={t('email_example')}
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
                        <FormLabel htmlFor="password">{t('password')}</FormLabel>
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
                    {t('sign_in')}
                </Button>
            </Card>
        </SignInContainer>
    );
};

export default LoginExecutive;
