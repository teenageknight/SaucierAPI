# Recipe-Aggregation-API

## Problem Statement

Given: n recipes, each with a number of steps
Goal: Combine the 3 recipe to minimize cooktime

Assumption:

- Same step accross recipe can be performed together.
- Steps labeled `inactive` can be performed in the background.
- The cook time of each step scales proportionally with the amount of ingredients.

Constraints:

- Number of pots cannot exceed the limit `max_pot`.
- All dishes should be ready within a time range `serve_interval`.
- Steps can only be performed when all other steps in `dependency` are done.

## High Level Action Items

- Define class structures
  - Meal: takes in multiple recipe and create 1 schedule
  - Recipe: takes in ingredients and schedule
  - Schedule: takes in multiple steps
  - Step: information about a step
- Define constraints
- Optimization algorithm based on assumptions & constraints
  - Approach 1: Greedy algorithm
    - put down the next available step of the longest recipe
  - Approach 2: [Job shop problem (JSP)](https://en.wikipedia.org/wiki/Job-shop_scheduling)
    - Treat ingredient, hardware, and chef as a 'machine' (e.g. (chef, pot1, ingredient) = machine A, a machine is only available when all its resources are available).
    - Each recipe is a 'job' and each step is a 'task'.
    - The dependency of each step is the 'precedence constraint'. Dependency of a recipe can be represented by a tree structure.
    - Inactive constraint can be modeled by hardware in used. (i.e. when a step is inactive, a 'chef' resource is freed up to perform the next task, but the ingredient necessary for some step might not be available yet.)
    - Check out the example on [Google OR Tool](https://developers.google.com/optimization/scheduling/job_shop).
- Outputs a schedule
