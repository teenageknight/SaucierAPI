import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { ButtonW } from '../components/ButtonW';
import { motion, useSpring, useScroll } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MealDesignerSteps } from '../components/MealDesigner/MealDesignerSteps';
import { RecipeCard } from '../components/RecipeCard';
import RecipeLocalData from '../data/recipe-json-files';

export const MealDesigner = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [mealList, setMealList] = useState([]);
    const [localRecipes, setLocalRecipes] = useState(RecipeLocalData);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // FIXME: ABSTRACT ALL INLINE STYLING
    const ModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 4,
        outline: 'none',
        p: 4,
    };

    function aggregate() {
        /** @todo calls recipe aggregation api and navigate to next page*/
        navigate('/compile', { state: { recipeList: mealList } });
    }

    function removeRecipe(recipe) {
        let tempMealList = [...mealList];
        let removeIndex = tempMealList.findIndex((value) => {
            return value === recipe;
        });
        tempMealList.splice(removeIndex, 1);
        let tempLocalRecipes = [...localRecipes];
        tempLocalRecipes.push(recipe);
        setMealList(tempMealList);
        setLocalRecipes(tempLocalRecipes);
    }

    return (
        <div className="mealDesignerPage">
            <Modal open={open} onClose={() => setOpen(false)} className="modal">
                <Box sx={ModalStyle}>
                    <h2>Meal Designer</h2>
                    <p>
                        People dont cook recipes, they cook meals! Use this tool
                        to put together your dream meal.
                    </p>
                    <ButtonW onClick={() => setOpen(false)} variant="contained">
                        Get Started!
                    </ButtonW>
                </Box>
            </Modal>
            {/* Scrollable Section */}
            {/* Add number four back in for the review section */}
            {[1, 2, 3].map((value, index) => {
                return (
                    <MealDesignerSteps
                        key={value}
                        id={value}
                        mealList={mealList}
                        setMealList={setMealList}
                        localRecipes={localRecipes}
                        setLocalRecipes={setLocalRecipes}
                    />
                );
            })}

            {/* Footer */}

            <div className="footer">
                <motion.div className="progress-bar" style={{ scaleX }} />
                <div className="footer-content">
                    <h4>Selected Recipes</h4>
                    <div className="footer-recipe-content">
                        {mealList.map((recipe, index) => {
                            return (
                                <RecipeCard
                                    key={index}
                                    recipe={recipe}
                                    onSelect={() => {
                                        removeRecipe(recipe);
                                    }}
                                    size={'small'}
                                    topButtonText="Remove"
                                />
                            );
                        })}
                    </div>
                    <div>
                        <ButtonW
                            onClick={() => aggregate()}
                            variant="contained"
                            round="true">
                            Generate Meal
                        </ButtonW>
                    </div>
                </div>
            </div>
        </div>
    );
};
