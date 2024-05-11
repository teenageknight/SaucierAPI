from typing import Union
from pydantic import BaseModel
from schemas import *

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from services.Recipe_To_Gantt.recipe_url_to_json import (
    extract_recipe_from_webpage,
    convert_recipe_to_json,
)
from services.Recipe_Aggregation.scheduler import recipe_scheduler
from services.schemas import Recipe
import spoonacular
from fastapi.responses import JSONResponse
from services.ConversationAI.recipe_conversation import normalize_prompt

configuration = spoonacular.Configuration(host="https://api.spoonacular.com")
configuration.api_key["apiKeyScheme"] = "SPOONTACULAR_KEY"

from docs import Docs

docs = Docs()

app = FastAPI(
    title=docs.title,
    summary=docs.summary,
    description=docs.description,
    version="0.0.1",
    openapi_url="/api/v1/openapi.json",
    openapi_tags=docs.tags_metadata,
)

origins = ["http://localhost:3000", "localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# TODO: Abstract and Remove
class AggregateRecipesBody(BaseModel):
    recipes: list[Union[dict]]


@app.get("/")
def read_root():
    return {"Hello": "World"}


# FIXME: response_model=RecipeModel add to the decorator to make the docs prety and fix return statement
@app.post("/recipe/extract", tags=["recipe"])
async def extract_recipe_from_url(request: ExtractRecipeFromUrl):
    # TODO: Eventually, some sort of validation would happen here.
    url = str(request.url)
    recipe = extract_recipe_from_webpage(url)
    if request.format == ExtractedRecipeFormat.unformatted:
        print("testing")
        return {"recipe": recipe, "format": request.format}
    custom_format_recipe = convert_recipe_to_json(recipe, "")
    return {"recipe": custom_format_recipe, "format": request.format}


@app.post("/recipe/aggregate", tags=["recipe"])
async def combine_recipes_into_meals(body: AggregateRecipesBody):
    recipes = body.recipes
    recipe_object_list = []

    for recipe in recipes:

        tempRecipe = Recipe()
        tempRecipe.parse(recipe)
        recipe_object_list.append(tempRecipe)

    aggregatedRecipe = recipe_scheduler(recipe_object_list)
    print(aggregatedRecipe)
    return {"recipe": aggregatedRecipe}


@app.get(
    "/ingredients/substitutes",
    tags=["ingredients"],
    response_model=IngredientSwapResponse,
)
async def get_ingredient_substitutes(ingredient: str):
    ingredient = ingredient.strip('"')
    # print()
    with spoonacular.ApiClient(configuration) as api_client:
        api_instance = spoonacular.IngredientsApi(api_client)
        ingredient_name = ingredient
        ingredient_id = None

        # First find the ingredient
        # This part may be obsolute tbh
        # try:
        #     api_search_response = api_instance.ingredient_search(query=ingredient_name)
        #     print("The response of IngredientsApi->ingredient_search:\n")
        #     print(api_search_response.results[0])
        #     ingredient_id = api_search_response.results[0].id
        #     print(ingredient_id)
        #     print(type(ingredient_id))
        # except Exception as e:
        #     print("Exception when calling IngredientsApi->ingredient_search: %s\n" % e)
        #     return JSONResponse(
        #         status_code=status.HTTP_400_BAD_REQUEST, content=ingredient_name
        #     )

        # Then search for it by ID
        try:
            # print(ingredient_id)
            api_response = api_instance.get_ingredient_substitutes(ingredient_name)
            print("The response of IngredientsApi->get_ingredient_substitutes_by_id:\n")
            print(api_response)
            return {
                "ingredient": ingredient_name,
                "substitutes": api_response.substitutes,
                "message": api_response.message,
            }
        except Exception as e:
            print(
                "Exception when calling IngredientsApi->get_ingredient_substitutes_by_id: %s\n"
                % e
            )
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "ingredient": ingredient_name,
                    "message": "Could not find substitutes for " + ingredient_name,
                    "substitutes": [],
                },
            )


@app.get("/ingredients/create-list", tags=["ingredients"])
def create_shopping_list():
    pass


@app.get(
    "/experimental/converse",
    tags=["experimental"],
    response_model=NormalizedChatbotResponse,
)
def talk_with_chatbot(user_prompt: str):
    print(user_prompt.strip())
    user_prompt = user_prompt.strip()
    # Make sure that you strip userprompt probably.
    normalized_user_prompt = normalize_prompt(user_prompt)
    return {"normalized_user_prompt": normalized_user_prompt}
