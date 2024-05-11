import Checkbox from '@mui/material/Checkbox';
import React, { useEffect, useState } from 'react';

export const ShoppingListStep = ({ mealList }) => {
    const [shoppingList, setShoppingList] = useState([]);

    useEffect(() => {
        function extrapolateShoppingList() {
            const tempShoppingList = mealList.reduce(
                (acc, meal) => [...acc, ...meal.ingredients],
                [],
            );
            setShoppingList(tempShoppingList);
        }
        extrapolateShoppingList();
    }, [mealList]);

    const handleItemClick = (index) => {
        const newList = [...shoppingList];
        newList[index].checked = !newList[index].checked;
        setShoppingList(newList);
    };

    return (
        <div
            style={{
                textAlign: 'center',
                fontSize: '1.5rem',
                marginTop: '2rem',
            }}>
            <p
                style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                }}>
                Your Shopping List
            </p>
            <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
                {mealList.length === 0 ? (
                    <p>
                        No recipes selected. Please go back to step one to
                        select a recipe.
                    </p>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div
                            style={{
                                maxHeight: '800px',
                                overflowY: 'auto',
                                columnCount: 2,
                            }}>
                            {shoppingList.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '0.5rem',
                                    }}>
                                    <div
                                        style={{
                                            position: 'relative',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            backgroundColor: '#ff84a9',
                                            borderRadius: '15px',
                                            padding: '5px',
                                            marginRight: '10px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleItemClick(index)}>
                                        <Checkbox
                                            checked={item.checked || false}
                                            style={{
                                                color: '#ffffff',
                                                marginRight: '5px',
                                            }}
                                        />
                                        <p
                                            style={{
                                                color: '#ffffff',
                                                fontSize: '1.2rem',
                                                margin: '0',
                                            }}>
                                            {item.amount} {item.unit}{' '}
                                            {item.name}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
