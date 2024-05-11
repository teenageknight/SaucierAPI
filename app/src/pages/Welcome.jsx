import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export const WelcomePage = () => {
    return (
        <div>
            <Box display="flex" alignItems="center" flexDirection={'column'}>
                <div>
                    <h1 style={{ textAlign: 'center' }}>Saucier Demo App</h1>
                    <h4>
                        Build powerful Recipe app features supercharged with UI
                    </h4>
                </div>
                <Stack spacing={2}>
                    <Button href="/build-a-meal" variant="contained">
                        Get Started
                    </Button>
                    <Button
                        href="http://127.0.0.1:8000/docs"
                        variant="outlined">
                        Docs
                    </Button>
                </Stack>
            </Box>
        </div>
    );
};
