import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { aggregateRecipe, waitForSecond } from '../utils';
import { Player } from '@lottiefiles/react-lottie-player';
import CookingLottie from '../assets/lotties/CookingAnimation.json';
import GraphVis from '../components/GraphVis';

const CompileRecipe = ({ route }) => {
    const { state } = useLocation();
    const { recipeList } = state;
    const [loading, setLoading] = useState(true);
    const [aggregateResult, setAggregateResult] = useState(null);

    useEffect(() => {
        async function callAggregate() {
            setLoading(true);
            let result = await aggregateRecipe(recipeList);
            await waitForSecond(3);
            setLoading(false);

            setAggregateResult(result.recipe);
        }

        if (loading && !aggregateResult) {
            // console.log('this searching should only run once');
            callAggregate();
        }
    }, [loading, recipeList, aggregateResult]);

    return (
        <div className="aggregate-recipe">
            {aggregateResult ? (
                <>
                    <GraphVis
                        recipeList={recipeList}
                        aggregatedRecipe={
                            aggregateResult && aggregateResult['aggregated']
                        }
                    />
                </>
            ) : (
                <>
                    <div className="transition-anim">
                        <Player
                            src={CookingLottie}
                            loop
                            autoplay
                            className="player"
                        />
                    </div>
                    <p className="transition-title">Magic Happening...</p>
                    <p className="quote">
                        "Food is not just sustenence. It's a cultural bridge,
                        source of comfort, and a canvas for creativity"
                    </p>
                </>
            )}
        </div>
    );
};

export default CompileRecipe;
