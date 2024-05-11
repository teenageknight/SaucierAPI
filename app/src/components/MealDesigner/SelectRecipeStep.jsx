import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import UnstableGrid from '@mui/material/Unstable_Grid2';
import { fetchRecipeFromUrl } from '../../utils';
import { RecipeCard } from '../../components/RecipeCard';
import { RecipeView } from '../../components/RecipeView';

export const SelectRecipeStep = ({
    mealList,
    setMealList,
    localRecipes,
    setLocalRecipes,
}) => {
    const [url, setUrl] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResult, setSearchResult] = useState(null);

    async function searchRecipe() {
        setSearching(true);
        let result = await fetchRecipeFromUrl(url);
        setSearching(false);
        setSearchResult(result);
    }

    const handleOpen = (event) => {
        console.log(event);
    };

    function selectRecipe(recipe) {
        let localRecipesTemp = [...localRecipes];
        let tempMealList = [...mealList];
        tempMealList.push(recipe);
        let removedIndex = localRecipesTemp.findIndex((value) => {
            return value === recipe;
        });
        localRecipesTemp.splice(removedIndex, 1);
        setLocalRecipes(localRecipesTemp);
        setMealList(tempMealList);
    }

    function addToMeal() {
        let tempCurrMeal = [...mealList, searchResult];
        setMealList(tempCurrMeal);
        setSearchResult(null);
        setUrl('');
    }

    return (
        <>
            <Grid container style={{ height: '90%', paddingTop: 10 }}>
                <Grid item xs={8}>
                    {/* Header Column */}
                    <div
                        style={{
                            flexDirection: 'row',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        {/* Spacer to properly center */}
                        <div style={{ flex: 1 }} />
                        <h3
                            style={{
                                flex: 1,
                                textAlign: 'center',
                            }}>
                            Our Recipes
                        </h3>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flex: 1,
                                justifyContent: 'flex-end',
                                paddingRight: 5,
                            }}>
                            <TextField
                                id="outlined-basic"
                                label="Search"
                                variant="outlined"
                                fullWidth
                                size="small"
                                // value={url}
                                // onChange={(e) => {
                                //     setUrl(e.target.value);
                                // }}
                                InputProps={{
                                    sx: { borderRadius: 3 },
                                }}
                            />
                            <IconButton
                                style={{ marginLeft: 10, marginRight: 10 }}
                                onClick={() => {
                                    console.log('No filter logic Yet');
                                }}>
                                <FilterListIcon />
                            </IconButton>
                        </div>
                    </div>

                    {/* FIXME: Try and disable scrollbar */}
                    <Grid
                        // disableEqualOverflow
                        container
                        maxHeight={520}
                        style={{
                            overflow: 'auto',
                            padding: 10,
                        }}>
                        {/* This will change to preloaded recipes.map */}
                        {localRecipes.map((recipe, index) => {
                            return (
                                <Grid
                                    key={index}
                                    item
                                    sm={6}
                                    md={4}
                                    minWidth={300}
                                    style={{ marginTop: 10 }}>
                                    <RecipeCard
                                        recipe={recipe}
                                        onClick={() => {}}
                                        onSelect={() => {
                                            selectRecipe(recipe);
                                        }}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                </Grid>
                <Divider
                    variant="middle"
                    orientation="vertical"
                    flexItem
                    sx={{ mr: '-1px' }}
                />
                <Grid
                    item
                    xs={4}
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <h3 style={{ textAlign: 'center' }}>From URL</h3>
                    <div
                        style={{
                            width: '90%',
                            paddingTop: 15,
                        }}>
                        <TextField
                            disabled={searching}
                            id="outlined-basic"
                            label="Enter Recipe Url"
                            variant="outlined"
                            fullWidth
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                            }}
                            InputProps={{
                                sx: { borderRadius: 50 },
                                endAdornment: (
                                    <InputAdornment position="start">
                                        {searching ? (
                                            <SearchIcon />
                                        ) : (
                                            <IconButton
                                                onClick={() => {
                                                    console.log('hello');
                                                    searchRecipe();
                                                }}>
                                                <SearchIcon />
                                            </IconButton>
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    {/* Consider changing the recipe card variant to a longer version of the card */}
                    <div style={{ width: '90%', paddingTop: 15 }}>
                        <RecipeView
                            recipe={searchResult}
                            loading={searching}
                            onButtonPress={addToMeal}
                        />
                    </div>
                </Grid>
            </Grid>
        </>
    );
};
