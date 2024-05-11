import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { swapIngredient } from '../../utils/api';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';

export const SwapIngredientStep = ({ mealList }) => {
    const [ingredient, setIngredient] = useState();
    const [ingredientList, setIngredientList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [swap, setSwap] = useState();

    useEffect(() => {
        function extrapolateIngredientList() {
            const tempIngredientList = mealList.reduce(
                (acc, meal) => [...acc, ...meal.ingredients],
                [],
            );
            setIngredientList(tempIngredientList);
        }
        extrapolateIngredientList();
    }, [mealList]);

    return (
        <div style={{ paddingLeft: '3rem' }}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <h4>Select an Ingredient</h4>
                    <div style={{ overflowY: 'scroll', maxHeight: 470 }}>
                        <FormControl>
                            <RadioGroup
                                onChange={(event) => {
                                    setIngredient(event.target.value);
                                }}>
                                {ingredientList.map((ing, i) => {
                                    return (
                                        <div key={i}>
                                            <FormControlLabel
                                                value={ing.name}
                                                control={<Radio />}
                                                label={ing.name}
                                            />
                                        </div>
                                    );
                                })}
                            </RadioGroup>
                        </FormControl>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    {swap ? (
                        loading ? (
                            <div>
                                <CircularProgress />
                            </div>
                        ) : (
                            <div>
                                <h4>Ingredient: {swap.ingredient}</h4>
                                <p>{swap.message}</p>
                                {swap.substitutes.map((sub, i) => {
                                    return <p key={i}>{sub}</p>;
                                })}
                            </div>
                        )
                    ) : (
                        <div></div>
                    )}
                </Grid>
            </Grid>
            <Button
                style={{ marginTop: 20 }}
                disabled={!ingredient}
                onClick={async () => {
                    setLoading(true);
                    let tempSwap = await swapIngredient(ingredient);
                    setSwap(tempSwap);
                    setLoading(false);
                }}
                variant="contained">
                Swap Ingredient
            </Button>
        </div>
    );
};
