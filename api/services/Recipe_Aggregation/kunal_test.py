import networkx as nx
from schemas import Recipe, Step  # Assuming these are defined in schemas.py
from typing import List
import matplotlib.pyplot as plt
import networkx as nx

def create_and_show_graph(recipes: List[Recipe]):
    G = nx.DiGraph()

    for recipe in recipes:
        for step in recipe.steps:
            G.add_node(step.step_id, label=step.name)

            for dep in step.dependency:
                G.add_edge(dep, step.step_id)

    pos = nx.spring_layout(G, k=0.15, iterations=20)
    plt.figure(figsize=(12, 12))
    nx.draw(G, pos, with_labels=True, labels=nx.get_node_attributes(G, 'label'), font_size=8, node_size=3000, node_color='skyblue', font_weight='bold', arrows=True)
    plt.title('Recipe Steps')
    plt.show()


def build_dag_and_schedule_steps(recipes: List[Recipe]) -> nx.DiGraph:
    G = nx.DiGraph()
    step_details = {}

    for recipe in recipes:
        for step in recipe.steps:
            step_id = step.step_id
            step_details[step_id] = step
            G.add_node(step_id)

            for dep in step.dependency:
                G.add_edge(dep, step_id)

    sorted_step_ids = list(nx.topological_sort(G))

    sorted_steps = [step_details[step_id] for step_id in sorted_step_ids]

    for step in sorted_steps:
        status = "Inactive" if step.active == 0 else "Active"
        print(f"Step {step.step_id} ({status}): {step.name}")

    return G

