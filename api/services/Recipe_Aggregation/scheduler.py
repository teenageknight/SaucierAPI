from typing import List

from services.schemas import *
import jsonpickle



def recipe_scheduler(recipe_list: List[Recipe], debug = False):
    """Schecdules recipe based on greedy algorithm

    Args:
        recipe_list (List[Recipe]): list of recipe object to sort
        debug (bool, optional): Sets to true for print statements. Defaults to False.

    Returns:
        str: recipe object in json format
    """
    # all_ingredients = set()
    completed = [] # in order of completion
    schedule = [] # in order of execution
    total_steps = 0
    total_time = 0
    frontier_nodes = set()
    union_graph = nx.DiGraph()

    # actual time spent at current iteration
    sacred_timeline = 0

    in_progress = {}
    step_table = {}  # maps step_id to step object

    def get_available_children(step) -> set[Step]:
        # returns list of steps that can be added
        frontier = set()
        children = set(union_graph.successors(step))
        for c in children:
            if c not in completed:
                # make sure dependencies are done,
                # make sure hardware are available,
                completed_names = set([n.step_id for n in completed])
                add = all(dep in completed_names for dep in c.dependency)
                if add:
                    frontier.add(c)
        return frontier

    def wait_for_next_step():
        closest_to_be_done_id = min(in_progress, key=lambda k: in_progress[k])
        advanced_time = in_progress[closest_to_be_done_id]
        in_progress.pop(closest_to_be_done_id)
        closest_to_be_done = step_table[closest_to_be_done_id]
        completed.append(closest_to_be_done)
        frontier_nodes.update(get_available_children(closest_to_be_done))
        if debug:
            print(
                f" t = {sacred_timeline} | {closest_to_be_done_id} is done after some wait"
            )
        for task in list(in_progress.keys())[:]:
            in_progress[task] -= advanced_time
            if in_progress[task] <= 0: # check other task with same wait time
                completed.append(step_table[task])
                frontier_nodes.update(get_available_children(step_table[task]))
                in_progress.pop(task)
                if debug:
                    print(
                        f" t = {sacred_timeline} | {task} is done after some wait"
                    )
        
        return advanced_time

    for recipe in recipe_list:
        r_graph = recipe.create_graph(show=debug)

        recipe.get_hardware()
        # all_ingredients.update(recipe.ingredients)
        total_steps += len(r_graph.nodes())
        total_time += sum([step.time for step in recipe.steps])
        union_graph = nx.union(union_graph, r_graph)
        step_table.update({step.step_id: step for step in recipe.steps})

    # treat two graphs as 1 disconnected graph
    frontier_nodes = {node for node, degree in union_graph.in_degree() if degree == 0}

    while len(completed) < total_steps:
        edges_list = []
        # get all edges of frontier_nodes
        for node in frontier_nodes:
            edges_from_node = [
                (union_graph.edges[edge]["weight"], edge)
                for edge in union_graph.out_edges(node)
            ]
            edges_list += edges_from_node

        # take lightest node in frontier node
        edges_list = sorted(edges_list, key=lambda x: x[0])

        if len(edges_list) == 0:
            if len(in_progress) == 0:
                completed += frontier_nodes
                break
            else:
                sacred_timeline += wait_for_next_step()
                continue

        lightest = edges_list[0][1][0]

        # perform lightest task
        frontier_nodes.remove(lightest)
        schedule.append((lightest, sacred_timeline))
        if lightest.active:
            time = lightest.time
            # first, check if any async task will be done during this action
            done_tasks = []
            for task, remaining_time in in_progress.items():
                if remaining_time - time < 0:
                    # the task is considered completed
                    done_tasks.append(task)
                else:
                    in_progress[task] -= time

            for task in done_tasks:
                completed.append(step_table[task])
                in_progress.pop(task)
                frontier_nodes.update(get_available_children(step_table[task]))
                if debug:
                    print(f" t = {sacred_timeline} | {task} is done in the background")

            # then, current time-stamp is moved forward by said amount of time
            sacred_timeline += time
            completed.append(lightest)
            if debug:
                print(f" t = {sacred_timeline} | {lightest.step_id} is done")
            frontier_nodes.update(get_available_children(lightest))
        else:  # the task is an inactive step
            # start timer
            in_progress[lightest.step_id] = lightest.time
            # if there are no more available action,
            # we have to wait for the step that is closest to be completed
            if len(frontier_nodes) == 0:
                sacred_timeline += wait_for_next_step()

    aggregated = Recipe(recipe_id= "Aggregated Recipe", name="Aggregated Recipe")
    aggregated.steps = completed
    aggregated.schedule = schedule
    aggregated.create_graph(show=debug)
    jsonObj = jsonpickle.encode(aggregated, unpicklable=False)
    if debug:
        print("Final Timeline:")
        print("Time Spent:", sacred_timeline)
        print("Summation of Recipe Time", total_time)
        for step in aggregated.steps:
            print(str(step))
        print(json.dumps(jsonObj))
    
    # with open('temp.json', 'w') as f:
    #     # Write the JSON data to the file
    #     f.write(jsonObj)
    
    payload = {"timeSpent" : sacred_timeline, "timeSum" : total_time, "aggregated" : json.loads(jsonObj) }
    return payload
    

