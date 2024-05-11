import React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

// Couldnt get the navigation to work, i got frusturated
export const Navbar = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
    pathnames.unshift('home');

    const breadcrumbNameMap = {
        '/search': 'Recipe Search',
        '/compile': 'Combine Recipe',
        '/cook-mode': 'Cook Mode',
    };

    function ListItemLink(props) {
        const { to, open, ...other } = props;
        const primary = breadcrumbNameMap[to];

        let icon = null;
        if (open != null) {
            icon = open ? <ExpandLess /> : <ExpandMore />;
        }

        return (
            <li>
                <ListItemButton component={RouterLink} to={to} {...other}>
                    <ListItemText primary={primary} />
                    {icon}
                </ListItemButton>
            </li>
        );
    }

    return (
        <div role="presentation" onClick={handleClick}>
            <Breadcrumbs aria-label="breadcrumb">
                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    var to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    if (to === '/home') {
                        to = '/';
                    }
                    console.log(to);

                    return last ? (
                        <Typography color="text.primary" key={to}>
                            {value}
                        </Typography>
                    ) : (
                        <Link
                            underline="hover"
                            color="inherit"
                            to={to}
                            key={to}>
                            {value}
                        </Link>
                    );
                })}
            </Breadcrumbs>
        </div>
    );
};
