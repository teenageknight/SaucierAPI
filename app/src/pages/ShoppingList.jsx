import React from 'react';

const ShoppingList = ({ aggregatedRecipe }) => {
    return (
        <div>
            <h1>Shopping List</h1>
            <u1>
                {aggregatedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                    </li>
                ))}
            </u1>
        </div>
    );
};
export default ShoppingList;
