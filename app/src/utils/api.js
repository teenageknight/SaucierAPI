const BASE_URL_DEV = 'http://localhost:8000';

/**
 * Calls the fastAPI locally to get the info about a parsed Recipe
 * @param {str} url The url of recipe to be parsed
 * @returns a valid JSON recipe object, not typed checked but that is parsed
 */
async function fetchRecipeFromUrl(url, format = 'custom') {
    console.log(format);
    const response = await fetch(BASE_URL_DEV + '/recipe/extract', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Request-Method': 'POST',
        },
        body: JSON.stringify({ url: url, format: format }),
    });
    const data = await response.json();

    let result;
    if (format === 'unformatted') {
        return data;
    }
    try {
        result = JSON.parse(data.recipe);
    } catch {
        result = await fetchRecipeFromUrl(url, 'unformatted');
    }

    return result;
}

async function aggregateRecipe(list_of_recipes) {
    console.log('Request | aggregateRecipe | Payload', list_of_recipes);
    const response = await fetch(BASE_URL_DEV + '/recipe/aggregate', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Request-Method': 'POST',
        },
        body: JSON.stringify({ recipes: list_of_recipes }),
    });
    const data = await response.json();
    console.log('Response | aggregateRecipe | Response', data);
    // let result = JSON.parse(data.recipe);

    return data;
}

async function swapIngredient(ingredient) {
    console.log(ingredient);
    const response = await fetch(
        BASE_URL_DEV +
            '/ingredients/substitutes?ingredient=' +
            JSON.stringify(ingredient),
    );
    const data = await response.json();
    console.log(data);

    return data;
}

async function getNormalizedUserPrompt(prompt) {
    const response = await fetch(
        BASE_URL_DEV +
            '/experimental/converse?user_prompt=' +
            JSON.stringify(prompt),
    );
    const data = await response.json();
    console.log(data);

    return data;
}

export {
    fetchRecipeFromUrl,
    aggregateRecipe,
    swapIngredient,
    getNormalizedUserPrompt,
};
