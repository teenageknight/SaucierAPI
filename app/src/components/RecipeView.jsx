import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// This file is for showing a full version of the recipe.
// Eventually you would want to have diffrent variants. I will build
// The small one first, but you would also want a full page one.

export const RecipeView = ({ recipe, loading, onButtonPress }) => {
    return loading ? (
        <div>
            <Skeleton>
                <h2>Sheet-Pan Feta With Chickpeas and Tomatoes</h2>
            </Skeleton>
            <Skeleton style={{ height: 400, marginTop: -60 }}></Skeleton>
            <Skeleton>
                <p>Prep Time</p>
                <p>Cook Time</p>
            </Skeleton>
            <Divider />
            <Skeleton>
                <p>
                    This is filler text for a description of the recipe. It
                    should be multi-line to encourage the use of multi line
                    option. This just keeps going and going
                </p>
            </Skeleton>
        </div>
    ) : recipe ? (
        <div className="recipe-view">
            <h3>{recipe.name}</h3>
            {recipe.prep_time ? (
                <div className="time">
                    <div className="icon-wrapper">
                        <AccessTimeIcon fontSize="inherit" />
                    </div>
                    <p>Prep Time: {recipe.prepTime} min</p>
                </div>
            ) : (
                <div></div>
            )}
            {recipe.cook_time ? (
                <div className="time">
                    <div className="icon-wrapper">
                        <AccessTimeIcon fontSize="inherit" />
                    </div>
                    <p>Cook Time: {recipe.cookTime} min</p>
                </div>
            ) : (
                <div></div>
            )}
            <Divider />
            {/* <p className="description">{recipe.description}</p> */}
            <Divider />
            <h4>Ingredients</h4>
            {recipe.ingredients.map((ing, i) => {
                if (ing.name) {
                    return (
                        <div>
                            <p>
                                {ing.amount} {ing.unit}&nbsp;
                                {ing.name}
                            </p>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <p>{ing}</p>
                        </div>
                    );
                }
            })}
            <Divider />
            <h4>Preperation</h4>
            {recipe.steps.map((step, i) => {
                if (step.description) {
                    return (
                        <div>
                            <p>
                                {i + 1}: {step.description}
                            </p>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <p>
                                {i + 1}: {step}
                            </p>
                        </div>
                    );
                }
            })}
            <Divider />
            <div className={'button'}>
                <Button onClick={onButtonPress} variant="contained">
                    Add to Meal
                </Button>
            </div>
        </div>
    ) : (
        <></>
    );
};
