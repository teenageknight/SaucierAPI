"""
This File rewrites json files for refactoring purposes
"""

import json
import glob

json_files = glob.glob("./app/src/data/recipe-json-files/*.json")


def add_order_id_and_make_step_id_unique():
    for file_name in json_files:
        with open(file_name, "r") as jsonFile:
            recipe = json.load(jsonFile)

            name = recipe["name"]
            for step in recipe["steps"]:
                order_id = step["step_id"]
                new_step_id = name + "-" + str(order_id)
                step["order_id"] = order_id
                step["step_id"] = new_step_id
                new_dep = []
                for dep in step["dependency"]:
                    new_dep.append(name + "-" + str(dep))
                step["dependency"] = new_dep

        # new_file_name = "/".join(file_name.split("/")[:-1]) + "/new_" + file_name.split("/")[-1]
        new_file_name = file_name
        with open(new_file_name, "w") as jsonFile:
            jstr = json.dumps(recipe, indent="\t", ensure_ascii=False)
            jsonFile.write(jstr)


def convert_min_to_sec():
    for file_name in json_files:
        with open(file_name, "r") as jsonFile:
            recipe = json.load(jsonFile)

            for step in recipe["steps"]:
                time = int(step["time"]) * 60
                step["time"] = str(time)

        # new_file_name = "/".join(file_name.split("/")[:-1]) + "/new_" + file_name.split("/")[-1]
        new_file_name = file_name
        with open(new_file_name, "w") as jsonFile:
            jstr = json.dumps(recipe, indent="\t", ensure_ascii=False)
            jsonFile.write(jstr)


add_order_id_and_make_step_id_unique()
# convert_min_to_sec()
