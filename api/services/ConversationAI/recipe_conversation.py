# import sys

# sys.path.append("..")
from ..schemas import Recipe
import openai
import json


def convert_to_recipe(json_file_path):
    with open(json_file_path) as json_file:
        data = json.load(json_file)[0]
    new_recipe = Recipe(
        recipe_id=data["recipe_id"],
        name=data["name"],
        steps=data["steps"],
        prep_time=data["prepTime"],
        cook_time=data["cookTime"],
        ingredients=data["ingredients"],
        servings=data["servings"],
        description=data["description"],
    )
    return new_recipe


def normalize_prompt(user_prompt):
    openai.organization = "ORG_ID"
    openai.api_key = "OPENAI_KEY"
    possible_responses = """
                        Start cooking the meal from the beginning.,
                        Go to the next step.,
                        Go to the previous step.,
                        Read this step again.,
                        Read the ingredients.,
                        Read the needed hardware.,
                        How long does this step take?,
                        Pause for some time.,
                        Resume.,
                        Finish the recipe cooking.
                        """
    prompt = (
        "Select the most appropriate prompt based on the user input prompt. User input: "
        + str(user_prompt)
        + "Possible responses: "
        + possible_responses
    )
    message = {"role": "user", "content": prompt}
    response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[message])
    normalized_prompt = response.choices[0].message.content.strip()
    return normalized_prompt


def cooking_mode(recipe, current_step):
    normalized_prompt = normalize_prompt(user_prompt)
    if_break = False
    match normalized_prompt:

        case "Start cooking the meal from the beginning.":
            current_step = 0
            response = "The first step is: " + recipe.steps[current_step]["description"]
            return response, current_step, if_break

        case "Go to the next step.":
            current_step += 1
            response = (
                "Moving to the next step. The next step is: "
                + recipe.steps[current_step]["description"]
            )
            return response, current_step, if_break

        case "Go to the previous step.":
            current_step -= 1
            response = (
                "Moving to the previous step. The previous step is: "
                + recipe.steps[current_step]["description"]
            )
            return response, current_step, if_break

        case "Read this step again.":
            response = (
                "The current step is: " + recipe.steps[current_step]["description"]
            )
            return response, current_step, if_break

        case "Read the ingredients.":

            response = "Ingredients for this step are:"
            for ingredient in recipe.steps[current_step]["ingredients"]:
                response = (
                    response
                    + " \n"
                    + ingredient["name"]
                    + " -- "
                    + str(ingredient["amount"])
                    + " "
                    + ingredient["unit"]
                )
            return response, current_step, if_break

        case "Read the needed hardware.":
            response = "Needed hardware for this step is:"
            for hardware in recipe.steps[current_step]["hardware"]:
                response += "\n" + hardware
            return response, current_step, if_break

        case "How long does this step take?":
            response = (
                "This step takes: "
                + str(recipe.steps[current_step]["time"] / 60)
                + " minutes"
            )
            return response, current_step, if_break

        case "Pause for some time.":
            response = "No problem! Take your time."
            return response, current_step, if_break

        case "Resume.":
            response = (
                "Resuming the cooking process. This is the current step: "
                + recipe.steps[current_step]["description"]
            )
            return response, current_step, if_break

        case "Finish the recipe cooking.":
            response = "The cooking process in complete."
            if_break = True
            return response, current_step, if_break


if __name__ == "__main__":

    recipe = convert_to_recipe("dummy.json")

    current_step = -1
    num_steps = len(recipe.steps)
    while current_step < num_steps - 1:
        user_prompt = input("Your prompt: ").strip('"')
        print("\n")
        response, current_step, if_break = cooking_mode(recipe, current_step)
        if if_break:
            break
        else:
            print(response)
            print("____________________________________")

    print("You have finished cooking! ")
