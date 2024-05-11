import React, { useState } from 'react';
import { TextField, Button, Grid, Paper } from '@mui/material';
import { getNormalizedUserPrompt } from '../utils/api';
import LocalRecipes from '../data/recipe-json-files';
import { useLocation } from 'react-router-dom';

export const CookingModePage = ({ recipe }) => {
    const [conversations, setConversations] = useState([]);
    const [inputText, setInputText] = useState('');
    const [currentStep, setCurrentStep] = useState(0);

    // This is just making sure there is a recipe in case one is not passed in
    // More elegant solutions exists, i just dont want to do it right now
    const { state } = useLocation();
    if (!state) {
        recipe = LocalRecipes[0];
    } else {
        recipe = state.recipe;
    }

    console.log(recipe);
    console.log(currentStep);

    const RESPONSE_SET = {
        START_COOKING_BEGINNING: 'Start cooking the meal from the beginning.',
        NEXT_STEP: 'Go to the next step.',
        PREVIOUS_STEP: 'Go to the previous step.',
        READ_AGAIN: 'Read this step again.',
        INGREDIENTS: 'Read the ingredients.',
        HARDWARE: 'Read the needed hardware.',
        LENGTH: 'How long does this step take?',
    };

    function cookingController(normalizedResponse) {
        switch (normalizedResponse) {
            case RESPONSE_SET.START_COOKING_BEGINNING:
                setCurrentStep(0);
                return (
                    'The first step is: ' +
                    recipe.steps[currentStep]['description']
                );
            case RESPONSE_SET.NEXT_STEP:
                let curr = currentStep;
                curr += 1;
                setCurrentStep(curr);

                return (
                    'Moving to the next step. The next step is: ' +
                    recipe.steps[currentStep]['description']
                );
            case RESPONSE_SET.PREVIOUS_STEP:
                // No detection for edge case of if it is the first step
                let tempCurr = currentStep;
                tempCurr += 1;
                setCurrentStep(tempCurr);
                return (
                    'Moving to the previous step. The previous step is: ' +
                    recipe.steps[currentStep]['description']
                );
            case RESPONSE_SET.READ_AGAIN:
                return recipe.steps[currentStep]['description'];
            case RESPONSE_SET.INGREDIENTS:
                let response = 'You will need the following ingredients:';
                recipe.steps[currentStep]['ingredients'].forEach((value, _) => {
                    response =
                        response +
                        '\n' +
                        value['name'] +
                        ' -- ' +
                        value['amount'].toString() +
                        ' ' +
                        value['unit'];
                });
                return response;
            // case RESPONSE_SET.HARDWARE:
            //     return;
            case RESPONSE_SET.LENGTH:
                return (
                    'This step takes: ' +
                    (recipe.steps[currentStep]['time'] / 60).toString() +
                    ' minutes'
                );
            default:
                return 'Sounds good!';
        }
    }

    const handleSendMessage = async (inputText) => {
        if (inputText.trim() !== '') {
            let normalizedResponse = await getNormalizedUserPrompt(
                inputText.trim(),
            );
            let response = cookingController(
                normalizedResponse['normalized_user_prompt'],
            );
            const newConversation = {
                user: inputText,
                chef: response,
            };
            setConversations([...conversations, newConversation]);
        }
    };

    return (
        <div className="cooking-mode">
            <h2> Your Cooking Assistant</h2>
            <Grid
                container
                justifyContent="center"
                style={{ marginTop: '20px' }}>
                <Grid item xs={6}>
                    <Paper style={{ padding: '20px' }}>
                        <div style={{ height: '300px', overflowY: 'auto' }}>
                            {conversations.map((conversation, index) => (
                                <div
                                    key={index}
                                    style={{ marginBottom: '10px' }}>
                                    <div
                                        style={{
                                            fontWeight: 'bold',
                                            marginBottom: '5px',
                                        }}>
                                        Your Prompt: {conversation.user}
                                    </div>
                                    <div
                                        style={{
                                            fontWeight: 'bold',
                                            marginBottom: '5px',
                                            color: 'orange',
                                        }}>
                                        Chef's Response: {conversation.chef}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <TextField
                            label="Type your message"
                            variant="outlined"
                            fullWidth
                            value={inputText}
                            onChange={(event) => {
                                setInputText(event.target.value);
                            }}
                            style={{ marginTop: '20px' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                const userInput = inputText;
                                handleSendMessage(userInput);
                                setInputText('');
                            }}
                            style={{ marginTop: '10px' }}>
                            Send
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};
