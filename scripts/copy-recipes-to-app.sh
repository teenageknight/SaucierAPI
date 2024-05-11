#!/bin/bash
# This script should be run from the root of the project, it will go into api/services/Recipe to Gantt/recipe_json_files,
# and copy all the files to the apps corresponding folder
# Can also be run from root with npm run scripts:cp-recipes
TARGET_DIRECTORY="../api/services/Recipe_To_Gantt/recipe_json_files"
OUTPUT_DIRECTORY="../../../../app/src/data/recipe-json-files"

OUTPUT_JSON="$OUTPUT_DIRECTORY/index.js"

# Copy all the current json recipes to the app
cd $TARGET_DIRECTORY
cp * $OUTPUT_DIRECTORY
echo "Copy all the current json recipes to the app"

# Create the index.json file
echo "" >"$OUTPUT_JSON"

num=0
for file in "."/*; do
    # Get just the filename
    filename=$(basename -- "$file")
    # Write out each import statement
    echo "import file$num from '$file';" >>"$OUTPUT_JSON"
    # Iterate Number
    num=$((num + 1))
done

echo "let recipes = [" >>"$OUTPUT_JSON"
FIRST=1
for i in $(seq 0 $((num - 1))); do
    if [ $FIRST -ne 1 ]; then
        echo "," >>"$OUTPUT_JSON"
    else
        FIRST=0
    fi
    echo "file$i" >>"$OUTPUT_JSON"
done

echo "]" >>"$OUTPUT_JSON"

echo "export default recipes;" >>"$OUTPUT_JSON"

echo "Created an index.js will all proper imports"
