import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import React, { useState } from 'react';
import defaultImage from '../assets/imgs/Recipe.png'; // This is the correct way to import

// This component can have size 'small' or 'medium'
export const RecipeCard = ({
    recipe,
    onClick,
    onSelect,
    size,
    topButtonText = 'Select',
}) => {
    const [isHover, setIsHover] = useState(false);

    const defaultImageUrl = '../../assets/imgs/Recipe.png';

    let backgroundImg = isHover
        ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${recipe.img || defaultImage}')`
        : `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('${recipe.img || defaultImage}')`;

    let displayTime;
    if (recipe.cookTime >= 60) {
        // Convert total minutes to hours and minutes
        const hours = Math.floor(recipe.cookTime / 60);
        const minutes = recipe.cookTime % 60;
        if (hours == 1) {
            displayTime = `${hours} hr ${minutes} min`;
        } else if (hours > 1) {
            displayTime = `${hours} hrs ${minutes} min`;
        }
    } else {
        displayTime = `${recipe.cookTime} min`;
    }

    return (
        <>
            {!recipe ? (
                <></>
            ) : (
                <Paper
                    onMouseEnter={() => {
                        setIsHover(true);
                    }}
                    onMouseLeave={() => {
                        setIsHover(false);
                    }}
                    onClick={onClick}
                    elevation={3}
                    style={{
                        height: size === 'small' ? '18vh' : 250,
                        width: size === 'small' ? 180 : 'auto',
                        backgroundImage: backgroundImg,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 10,
                        margin: 4,
                        justifyContent: 'space-between',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <p
                        style={{
                            color: 'white',
                            paddingTop: 10,
                            paddingLeft: 10,
                        }}>
                        {recipe.name}
                    </p>
                    {isHover ? (
                        <div
                            style={{
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 10,
                            }}>
                            <Button
                                onClick={onSelect}
                                style={{ marginTop: 10 }}
                                variant="contained">
                                {topButtonText}
                            </Button>
                            {size === 'small' ? (
                                <></>
                            ) : (
                                <Button
                                    style={{ marginTop: 10 }}
                                    variant="outlined">
                                    View Recipe
                                </Button>
                            )}
                        </div>
                    ) : (
                        <></>
                    )}

                    {size === 'small' ? (
                        <div></div>
                    ) : (
                        <div
                            style={{
                                display: 'flex',
                                backgroundColor: '#ece8dd',
                                borderRadius: 20,
                                marginLeft: 10,
                                maxWidth: 200,
                                padding: 5,
                                paddingRight: 10,
                                paddingLeft: 10,
                                marginBottom: 10,
                                justifyContent: 'space-around',
                            }}>
                            <PeopleIcon />
                            <p>{recipe.servings}</p>
                            <AccessTimeIcon />
                            <p>{displayTime}</p>
                        </div>
                    )}
                </Paper>
            )}
        </>
    );
};
