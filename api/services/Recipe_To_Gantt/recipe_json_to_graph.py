
import json
import networkx as nx
import matplotlib.pyplot as plt

class Step_Node:
    def __init__(self, step_id, step_name, step_time):
        """Nodes used to represent each step
        Args:
            step_id (int): unique id (within the recipe) for each step
            step_name (str): name of step
            step_time (float): time taken for step
        """

        self.step_id = step_id
        self.step_name = step_name
        if '-' in step_time:
            start_time, end_time = step_time.split('-')
            start_time, end_time = float(start_time), float(end_time)
            avg = (end_time + start_time) / 2
            self.step_time = avg
        else:
            self.step_time = float(step_time)
    
    # To ensure nodes are identifiable, let's define __hash__ and __eq__
    def __hash__(self):
        return hash(self.step_id)
    
    def __eq__(self, other):
        return isinstance(other, Step_Node) and self.step_id == other.step_id
    
    def __repr__(self):
        return f"{self.step_name} ({self.step_id})"


json_file_path = "../../Intermediate_Representation/KD_Intermediate_Representation.json"

with open(json_file_path, 'r') as file:
    recipe_data = json.load(file)

def create_graph_from_recipes(recipe_data):
    for _, recipe_value in recipe_data.items():
        nodes_dict = {}
        DG = nx.DiGraph()

        step_array = recipe_value["steps"]
        
        # Add all nodes to graph
        for step in step_array:
            id, name, time = step["step_id"], step["name"], step["time"]
            node = Step_Node(id, name, time)
            DG.add_node(node)
            nodes_dict[id] = node
        
        # Add dependencies as directed edges
        edge_labels = dict()
        for step in step_array:
            curr_id = step["step_id"]
            for prereq_id in step["dependency"]:
                prev_node, curr_node = nodes_dict[prereq_id], nodes_dict[curr_id]
                DG.add_edge(prev_node, curr_node, weight=prev_node.step_time)
                edge_labels[(prev_node, curr_node)] = prev_node.step_time
        
        # i hate graph formatting pls save me
        pos = nx.spring_layout(DG, k=0.15, iterations=20)

        nx.draw(DG, pos, with_labels=True, node_size=1000, node_color='skyblue',
                font_size=10, font_weight='bold', width=2, edge_color='grey')
        
        edge_labels = nx.get_edge_attributes(DG, 'weight')
        nx.draw_networkx_edge_labels(DG, pos, edge_labels=edge_labels, label_pos=0.5,
                                     font_size=9, font_color='red')
        plt.axis('off')
        plt.show()

create_graph_from_recipes(recipe_data)