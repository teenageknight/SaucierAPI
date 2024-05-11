"""
This File rewrites json files for refactoring purposes
"""
import json
FILES = [
    "AM Intermediate Representation.json",
    "BJ Intermediate Representation.json",
    "KD Intermediate Representation.json"
]

path = "api/Intermediate Representations/"
def add_order_id_and_make_step_id_unique():
    for file_name in FILES:
        with open(path + file_name, "r") as jsonFile:
            data = json.load(jsonFile)
            for recipe in data:
                name = recipe['name']
                for step in recipe['steps']:
                    order_id = step['step_id']
                    new_step_id = name + "-" +str(order_id)
                    step['order_id'] = order_id
                    step['step_id'] = new_step_id
                    new_dep = []
                    for dep in step['dependency']:
                        new_dep.append(name + "-" +str(dep))
                    step['dependency'] = new_dep
        
        with open(path + "new_" + file_name, "w") as jsonFile:
            jstr = json.dumps(data, indent='\t', ensure_ascii=False)
            jsonFile.write(jstr)

# Run rewrites here             
# add_order_id_and_make_step_id_unique()