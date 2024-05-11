import networkx as nx
import matplotlib.pyplot as plt
def draw_graph(graph):
    # TODO Make graph nicer
    """Draws a graph given a nx.DiGraph
    Args:
        graph (DiGraph): DiGraph object
    """
    pos = nx.spring_layout(graph, k=0.15, iterations=20)
    
    
    
    
    # nx.draw(graph, pos, with_labels=True, node_size=1000, node_color='skyblue',
    #         font_size=10, font_weight='bold', width=2, edge_color='grey',
    #         cmap=plt.cm.Blues, arrows=True, arrowstyle='->', arrowsize=10)
    # nx.draw(graph, pos, with_labels=True, node_size=1000, node_color='skyblue',
    #         font_size=10, font_weight='bold', width=2, edge_color='grey')


    nx.draw(graph, pos, with_labels=True, node_size=1000, node_color='skyblue',
            font_size=10, font_weight='bold', width=2, edge_color='grey')
    
    edge_labels = nx.get_edge_attributes(graph, 'weight')
    nx.draw_networkx_edge_labels(graph, pos, edge_labels=edge_labels, label_pos=0.5,
                                font_size=9, font_color='red')

    # degree_centrality = nx.degree_centrality(graph)
    # node_color = [degree_centrality[node] for node in graph.nodes()]
    # betweenness_centrality = nx.betweenness_centrality(graph)
    # node_size = [betweenness_centrality[node] * 3000 for node in graph.nodes()]
    # nx.draw(graph, pos, with_labels=True, node_size=node_size, node_color=node_color,
    #         font_size=10, font_weight='bold', width=2, edge_color='grey',
    #         cmap=plt.cm.Blues, arrows=True, arrowstyle='->', arrowsize=10)
    
    plt.axis('off')
    plt.show()