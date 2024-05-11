import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

export const ButtonW = styled(Button)(({ round }) => ({
    borderRadius: round ? 50 : 4,
}));
