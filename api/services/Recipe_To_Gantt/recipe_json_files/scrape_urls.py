# The purpose of this file is to populate the recipe_json_files folder with a json recipe for each recipe url in urls.txt
# As the scraper changes, rerun this file to generate new "intermediate representions" (don't unecessarily do -- will run up OpenAI bill!)

import os
import sys
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)
from recipe_url_to_json import *

import json

failiureCount = 0
totalCount = 0

with open('urls.txt', 'r') as urls:
    for url in urls:
        url = str(url).strip()
        print(f'parsing {url} ...')

        baseRecipe = extract_recipe_from_webpage(url)
        
        if (create_json(baseRecipe) == True):
            try:
                test_json(f'{baseRecipe["name"]}.json')
                print('success!')
            except Exception as E:
                print (f'test_json failed: {E}')
        else:
            print('failiure: could not create JSON')
            failiureCount += 1

        totalCount += 1

print(f'Number of Failiures: {failiureCount} ({int((failiureCount / totalCount) * 100)}%)')