export const delay = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
