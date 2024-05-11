"""
This file contains all of the classes that we will use to represent our data in the application.
"""

import json
import networkx as nx
from typing import List
from services.Recipe_Aggregation.util import GraphDrawer


class Ingredient:
    def __init__(self, name: str = "", main_ingredient: str = "", classifier: str = "", amount: int = 0, unit: str = "") -> None:
        """Ingredients are the building blocks of recipes

        Args:
            name (str): name of the ingredient
            main_ingredient (str): the main ingredient
            classifier (str): a classifier that describes the ingredient
            amount (int): amount of the ingredient
            unit (str): unit of the ingredient
        """
        self.name = name
        self.main_ingredient = main_ingredient
        self.classifier = classifier
        self.amount = amount
        self.unit = unit

    def parse(self, data: json):
        """Parse json string to object

        Args:
            data (json): json object
        """
        self.name = data.get("name", "")
        self.main_ingredient = data.get("main_ingredient", "")
        self.classifier = data.get("classifier", "")
        self.amount = data.get("amount", 0)
        self.unit = data.get("unit", "")

    def __str__(self):
        return f"{self.amount} {self.unit} of {self.name}"


class Step:
    def __init__(
        self,
        step_id: str = "undefined",
        order_id: int = -1,
        name: str = "",
        description: str = "",
        ingredients: List[Ingredient] = [],
        hardware: List[str] = [],
        active: bool = True,
        dependency: List[str] = [],
        time: int = 0,
    ) -> None:
        """All recipes are made up of a series of steps.

        Args:
            step_id (int): unique id to identify the step
            name (str): Title of the step, a description of what the step is
            ingredients (list[Ingredient]): list of ingredients and amounts required for each step
            hardware (list[str]): list of required hardware for a step
            active (bool): boolean representing if the step requires a chef to be active
            dependencies (list[str]): dependency array of the steps that need to be completed before this step
            time (int, optional): length of time in seconds this step takes. Defaults to 0.
        """
        self.step_id = step_id
        self.order_id = order_id
        self.name = name
        self.ingredients = ingredients
        self.hardware = hardware
        self.active = active
        self.dependency = dependency
        self.time = time
        self.description = description

    def get_required_resources(self):
        resources = set(self.hardware)
        if self.active:
            resources.add("chef")
        return resources

    def parse(self, data: json):
        """Parse json string to object

        Args:
            data (json): json object
        """
        self.step_id = data.get("step_id", "")
        self.order_id = data.get("order_id", -1)
        self.name = data.get("name", "")
        self.description = data.get("description", "")
        self.hardware = data.get("hardware", [])
        ingredients = []
        for ing in data.get("ingredients", []):
            ingr = Ingredient()
            ingr.parse(ing)
            ingredients.append(ingr)
        self.ingredients = ingredients
        self.time = int(data.get("time", 0))
        self.active = data.get("active", 1)
        self.dependency = data.get("dependency", [])

    def __str__(self):
        return f"{self.step_id}: {self.name} | Takes {self.time}"

    def __hash__(self):

        return hash(str(self.name) + str(self.step_id))

    def __eq__(self, other):
        # two steps are equal if they require same ingredients, hardware, chef
        if not isinstance(other, Step):
            return False
        ing = set(self.ingredients) == set(other.ingredients)
        hardware = set(self.hardware) == set(other.hardware)
        chef = self.active == other.active
        step = self.step_id == other.step_id
        return ing and hardware and chef and step


class Recipe:
    def __init__(
        self,
        recipe_id: str = "undefined",
        name: str = "",
        steps: List[Step] = [],
        prep_time: int = 0,
        cook_time: int = 0,
        ingredients: List[str] = [],
        servings: int = 0,
        description: str = "",
    ) -> None:
        """Summary

        Args:
            recipe_id (str): Unique identifier for the recipe
            name (str): Title of the recipe
            steps (list[Step]): list of steps that a recipe has
            prep_time (int): len in seconds of prep time
            cook_time (int): len in seconds of cook time
            ingredients (list[str]): list of ingredients names that are used in the recipe
            servings (str, optional): description of how many servings the recipe makes. Defaults to "".
            schedule (str, optional): graphical representation of how you would progress throught the recipe (TODO: Fix with new type). Defaults to "".
            description (str, optional): Optional string describing the recipe. Defaults to "".
        """
        self.recipe_id = recipe_id
        self.name = name
        self.description = description
        self.steps = steps
        self.prep_time = prep_time
        self.cook_time = cook_time
        self.servings = servings
        self.ingredients = ingredients
        self.schedule = None

    def parse(self, data: json):
        """Parse json string to object

        Args:
            data (json): json object
        """

        self.recipe_id = data.get("recipe_id", "")
        self.name = data.get("name", "")
        self.description = data.get("description", "")
        steps = []
        for st in data.get("steps", []):
            step = Step()
            step.parse(st)
            steps.append(step)
        self.steps = steps

        self.prep_time = int(data.get("prepTime", 0))
        self.cook_time = int(data.get("cookTime", 0))
        self.ingredients = data.get("ingredients", [])
        self.hardware = data.get("hardware", [])
        self.servings = data.get("servings", 0)

    def get_hardware(self):
        hardware = set()
        for step in self.steps:
            hardware.update(step.hardware)
        return hardware

    def create_graph(self, show=False):
        recipe_graph = nx.DiGraph()
        edge_labels = dict()
        nodes_dict = {}
        # add nodes
        for step in self.steps:
            recipe_graph.add_node(step)
            nodes_dict[step.step_id] = step

        # add edges
        for step in nodes_dict.values():
            curr_id = step.step_id
            for prereq_id in step.dependency:
                prev_node, curr_node = nodes_dict[prereq_id], nodes_dict[curr_id]

                if prev_node.active:
                    weight = int(prev_node.time) ** 4
                else:
                    weight = prev_node.time

                recipe_graph.add_edge(prev_node, curr_node, weight=weight)
                edge_labels[(prev_node, curr_node)] = weight
        # create end node
        last_steps = [
            node.step_id
            for node in self.steps
            if len(list(recipe_graph.successors(node))) == 0
        ]
        l = len(self.steps)
        done_step_id = self.name + "-DONE"
        done_step = Step(
            step_id=done_step_id, order_id=l + 1, name="DONE", dependency=last_steps
        )
        self.done_node = done_step
        for prereq_id in done_step.dependency:
            prev_node, curr_node = nodes_dict[prereq_id], done_step

            if prev_node.active:
                weight = prev_node.time**4
            else:
                weight = prev_node.time

            recipe_graph.add_edge(prev_node, curr_node, weight=weight)
            edge_labels[(prev_node, curr_node)] = weight

        if show:
            print("SHOW GRAPH")
            GraphDrawer.draw_graph(recipe_graph)
        return recipe_graph

    def __str__(self):
        steps_str = "\n".join("\t" + str(step) for step in self.steps)
        return f"Recipe: {self.name}\nPreptime: {self.prep_time}\nCooktime: {self.cook_time}\nSteps: \n{steps_str}\nIngredients: {str(self.ingredients)}\n"
