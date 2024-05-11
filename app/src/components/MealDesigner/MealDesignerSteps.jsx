import React from 'react';
import { SelectRecipeStep } from './SelectRecipeStep';
import { SwapIngredientStep } from './SwapIngredientStep';
import { ShoppingListStep } from './ShoppingListStep';

export const MealDesignerSteps = ({
    id,
    mealList,
    setMealList,
    localRecipes,
    setLocalRecipes,
}) => {
    const TITLES = [
        'Select your Recipes',
        'Swap Ingredients',
        'Create Shopping List',
        'Review',
    ];

    let step;
    switch (id) {
        case 1:
            step = (
                <SelectRecipeStep
                    mealList={mealList}
                    setMealList={setMealList}
                    localRecipes={localRecipes}
                    setLocalRecipes={setLocalRecipes}
                />
            );
            break;
        case 2:
            step = <SwapIngredientStep mealList={mealList} />;
            break;
        case 3:
            step = <ShoppingListStep mealList={mealList} />;
            break;
        default:
            step = <div />;
    }

    return (
        <section>
            <h2 className="step-title">
                Step {id}: {TITLES[id - 1]}
            </h2>
            {step}
        </section>
    );
};
