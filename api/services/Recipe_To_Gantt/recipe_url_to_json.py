import openai
import json
import requests
from recipe_scrapers import scrape_me
from recipe_scrapers import scrape_html
import os


# Function for printing the recipe for testing
def print_recipe(recipe):
    print(f"Recipe Name: {recipe['name']}")
    print(f"Description: {recipe['description']}")
    print("\nIngredients:")
    for ingredient in recipe["ingredients"]:
        print(f"- {ingredient}")
    print("\nSteps:")
    for i, step in enumerate(recipe["steps"], start=1):
        print(f"Step {i}: {step['description']}")
    print(f"Servings: {recipe['servings']}")
    print(f"Nutrients: {recipe['nutrients']}")


# function for extracting/parsing the recipe from the url
def extract_recipe_from_webpage(url):
    scraper = scrape_me(url)
    recipe = {
        "name": scraper.title(),
        "description": scraper.title(),
        "ingredients": scraper.ingredients(),
        "steps": [{"description": step} for step in scraper.instructions().split("\n")],
        "servings": scraper.yields(),
    }
    html = requests.get(url).content
    scraper = scrape_html(html=html, org_url=url)
    try:
        recipe["cook_time"] = scraper.cook_time()
    except:
        print("Can't parse cooking time.")
    try:
        recipe["prep_time"] = scraper.prep_time()
    except:
        print("Can't parse preparation time.")
    try:
        recipe["nutrients"] = (scraper.nutrients(),)
    except:
        print("Can't parse nutrients.")

    return recipe


# function to create the initial Json file
# attempts to convert the recipe into a desired json format 3 times
def create_json(recipe):
    num_attempts = 0
    previous_errors = ""
    while True:
        if num_attempts >= 3:
            print("Failed to generate a JSON file after 3 attempts.")
            return False

        try:
            recipe_json = json.loads(convert_recipe_to_json(recipe))
            with open(f'{recipe_json["name"]}.json', "w") as json_file:
                json.dump(recipe_json, json_file, indent=4)
            return True

        except Exception as e:
            print(f"Failed to create JSON: {e}")
            previous_errors += str(e)

        num_attempts += 1


# function to test the types of values in the json file
def test_json(file_name):

    with open(file_name, "r") as json_file:
        data = json.load(json_file)

    # Check ingredients
    for ingredient in data["ingredients"]:
        # Ensure amount is a float
        if not isinstance(ingredient["amount"], float):
            try:
                ingredient["amount"] = float(ingredient["amount"])
            except ValueError:
                print(
                    f"Unable to cast amount '{ingredient['amount']}' to float for ingredient '{ingredient['name']}'"
                )

    # Check steps
    for step in data["steps"]:
        if not isinstance(step["time"], int):
            try:
                step["time"] = int(step["time"])
            except ValueError:
                print(
                    f"Unable to cast time '{step['time']}' to integer for step '{step['step_id']}'"
                )

        # Check ingredients within the step
        for ingredient in step["ingredients"]:
            if not isinstance(ingredient["amount"], float):
                try:
                    ingredient["amount"] = float(ingredient["amount"])
                except ValueError:
                    print(
                        f"Unable to cast time '{ingredient['amount']}' to float for step '{step['step_id']}'"
                    )

    # Check prepTime, cookTime, and servings
    for field in ["prepTime", "cookTime", "servings"]:
        if not isinstance(data[field], int):
            try:
                data[field] = int(data[field])
            except ValueError:
                print(f"Unable to cast {field} '{data[field]}' to integer")

    with open(file_name, "w") as json_file:
        json.dump(data, json_file, indent=4)

    print("Modified JSON file saved successfully.")


# function for calling the GPT-3.5 instance
def convert_recipe_to_json(recipe, previous_error=""):
    openai.organization = "ORG_ID"
    openai.api_key = "API_SECRET_KEY"

    format = """{
    "name": "NAME OF THE RECIPE",
    "description": "DESCRIPTION OF RECIPE.",
    "nutrients": DICTIONARY OF NUTRIENTS (IF EXIST IN THE RECIPE OBJECT OR EMPTY DICTIONARY)
    "ingredients": [
        {
            "name": "FULL NAME OF INGREDIENT NAME" -- string,
            "main_ingredient": "MAIN INGREDIENT (SUCH AS POTATO or BUTTER)" -- string,
            "classifier": "ADJECTIVE-IDENTIFIER FOR THE INGREDIENT IF EXISTS, else '' (I.E. 'SLICED' for 'SLICED POTATO')" -- string,
            "amount": "QUANTITY (NUMBER OF UNITS)" -- float,
            "unit": "UNIT (LIKE CUP, SPOON, ETC) -- string"
        }
    ],
    "steps": [
        {
            "order_id": "UNIQUE NUMBER OF THE STEP" -- int,
            "step_id": <recipe_name>-<order_id> for example "recipe_name_1" -- string
            "name": "SHORT NAME BASED ON DESCRIPTION" -- string,
            "description": "DESCRIPTION OF RECIPE" -- string,
            "time": "HOW MUCH TIME THIS STEP TAKES IN SECONDS (NOT MINUTES!) (if not stated in the recipe->use the prep and cook time to estimate how long it should take or use data how long a similar task takes(if no cook/prep time))) -- integer",
            "hardware": [
                "WHAT HARDWARE IS REQUIRED" [list of strings]
            ],
            "ingredients": [
                {
                    "name": "FULL NAME OF INGREDIENT NAME" -- string,
                    "main_ingredient": "MAIN INGREDIENT (SUCH AS POTATO)" -- string,
                    "classifier": "ADJECTIVE -IDENTIFIER FOR THE INGREDIENT IF EXISTS, else '' (I.E. 'SLICED' for 'SLICED POTATO')" -- string,
                    "amount": "QUANTITY(NUMBER)" -- float,
                    "unit": "UNIT (LIKE CUP, SPOON, ETC) -- string"
                }
            ],
            "active": 1 (if it needs physical action that needs hands) or 0 (if it doesn't need physical action like heating oven/waiting),
            "dependency": [LIST OF STEP_IDS THAT ARE NEEDED FOR THIS STEP]
        }
    ],
    "prepTime": "TOTAL PREP TIME IN SECONDS (multiply by 60) -- should always exist (take this number from the recipe object or calculate based on the steps)",
    "cookTime": "TOTAL COOK TIME IN SECONDS (multiply by 60) -- should always exist (take this number from the recipe object or calculate based on the steps)",
    "servings": "NUM OF SERVINGS" -- integer
    }"""

    prompt = (
        "Convert the following recipe into the JSON format that contains no syntax errors or missing delimiters: \n"
        + "recipe: "
        + str(recipe)
        + "format: "
        + format
    )

    if previous_error != "":
        print("Added an error message to the prompt. ")

        prompt = prompt + "Make sure that this doesn't happen: " + str(previous_error)

    message = {"role": "user", "content": prompt}

    response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[message])

    converted_recipe = response.choices[0].message.content.strip()

    return converted_recipe


def main():
    recipe_url = input("Please provide the URL of the recipe webpage: ").strip('"')
    recipe = extract_recipe_from_webpage(recipe_url)

    if create_json(recipe) == True:
        test_json(f'{recipe["name"]}.json')
    else:
        print("failed to generate json for recipe url")

    # test_json("recipe_json_files/Honey Glazed Chicken.json")


if __name__ == "__main__":
    main()
