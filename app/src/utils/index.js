export { fetchRecipeFromUrl, aggregateRecipe } from './api';
export function waitForSecond(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}
