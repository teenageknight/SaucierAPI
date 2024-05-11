class Docs:
    def __init__(self):
        self.title = "SaucierAPI"
        self.summary = "This documentation (📖) aims to provide documentation of all avalible API endpoints for this service. It shows a sample requests to each endpoints, and allows you to run them locally (🧪)."
        self.description = """
The SaucierAPI will help you solve all your cooking related problems 🍲.

Using our knowlege of food ontology, we bring you the solutions to all 
of your cooking related problems. From ingredients swaping (🥩 to 🥗) to 
conversational AI's (🤖), we help you easily tackle some of the hardest
problems in food tech.
"""
        self.tags_metadata = [
            {
                "name": "recipe",
                "description": "Everything related to gathering recipes, formating them, etc.",
            },
            {
                "name": "ingredients",
                "description": "Handles the computations for ingredients, including parseing, substitutes and amounts.",
            },
            {
                "name": "experimental",
                "description": "All of the features in this section are _experimental_ meaning they are mostly working, but have not had a full testing lifecycle.",
            },
        ]
