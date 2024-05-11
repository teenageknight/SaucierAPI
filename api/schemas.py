"""
This file is for global api request schemas. These are diffrent than our class file, also called schema's
but this is for the pydantic models.

More info: https://fastapi.tiangolo.com/python-types/#pydantic-models
"""

from pydantic import AnyUrl, BaseModel
from enum import Enum


class ExtractedRecipeFormat(str, Enum):
    custom = "custom"
    unformatted = "unformatted"


class ExtractRecipeFromUrl(BaseModel):
    url: AnyUrl
    format: ExtractedRecipeFormat


class Nutrients(BaseModel):
    calories: str
    carbohydrateContent: str
    cholesterolContent: str
    fiberContent: str
    proteinContent: str
    saturatedFatContent: str
    sodiumContent: str
    fatContent: str
    unsaturatedFatContent: str


class Ingredient(BaseModel):
    name: str
    main_ingredient: str
    amount: str
    unit: str


class Step(BaseModel):
    step_id: str
    name: str
    description: str
    time: int  # this actually should be encoded as a int or datetime part
    hardware: list[str]
    ingredients: list[Ingredient]
    active: int
    dependency: list[str]
    prepTime: str
    cookTime: str
    servings: str


class RecipeModel(BaseModel):
    name: str
    description: str
    img: str | None
    nutrients: Nutrients
    ingredients: list[Ingredient]
    steps: list[Step]


class IngredientSwapResponse(BaseModel):
    ingredient: str
    message: str
    substitutes: list[str]


class NormalizedChatbotResponse(BaseModel):
    normalized_user_prompt: str  # FIXME: Change to enum later
