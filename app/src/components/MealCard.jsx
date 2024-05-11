import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React from 'react';
import RecipeImg from '../assets/imgs/Recipe.png';

const RecipeCard = ({ recipe, hidden, onClick, selected }) => {
    return (
        <>
            {!recipe || hidden ? (
                <></>
            ) : (
                <div
                    className={
                        selected ? 'recipe-card-selected' : 'recipe-card'
                    }
                    onClick={onClick}>
                    <div
                        style={{
                            alignItems: 'center',
                            display: 'flex',
                        }}>
                        <img
                            src={recipe.img ? recipe.img : RecipeImg}
                            alt="dummy"
                        />
                    </div>

                    <div className="info-block">
                        <p className="name">{recipe.name}</p>
                        <div style={{ display: 'flex' }}>
                            <div className="time">
                                <div className="icon-wrapper">
                                    <AccessTimeIcon fontSize="inherit" />
                                </div>
                                <p>Prep Time: {recipe.prepTime}</p>
                            </div>
                            <div className="time">
                                <div className="icon-wrapper">
                                    <AccessTimeIcon fontSize="inherit" />
                                </div>
                                <p>Cook Time: {recipe.cookTime}</p>
                            </div>
                        </div>
                        <div className="ingredients">
                            {recipe.ingredients.map((ing, i) => {
                                return i === recipe.ingredients.length - 1
                                    ? ing.amount +
                                          ' ' +
                                          ing.unit +
                                          ' ' +
                                          ing.name
                                    : ing.amount +
                                          ' ' +
                                          ing.unit +
                                          ' ' +
                                          ing.name +
                                          ', ';
                            })}
                        </div>
                        {/* <div className="nutrition">
                            <p>Nutrition:</p>
                            {Object.entries(recipe.nutrition).map(
                                ([key, value]) => (
                                    <div key={key} className="nutrition-item">
                                        <span>{key}:</span>
                                        <span>{value}</span>
                                    </div>
                                ),
                            )}
                        </div> */}
                    </div>
                </div>
            )}
        </>
    );
};

export default RecipeCard;
