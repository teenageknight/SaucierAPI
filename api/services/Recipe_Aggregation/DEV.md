4/1 Mon 8:00am - Writing parser and setting up envrionment is "easy" but time consuming, and so is every other aspect of implementation. Also, Jupyter is weird when it comes to importing.

4/1 Mon 10:00pm - Added additional recipe graph to Jupyter notebook. Working through pseudocode for recipe aggregation given that two recipes are completely independent. This means we want to utilize time in inactive steps the best we can.

"Food is not just sustenence. It's a cultural bridge, source of comfort, and a canvas for creativity" - ChatGPT

4/2 Tue 10:30pm - Basic Topological sort implemented. Since visited node will not be traversed again, perhaps adding reward (reducing weight) to highly repeated step is sufficient for good recommendation. This way, we just have to work on inactive step (asyncronous task) and hardware constraint.

4/3 Wed 10:00pm - Actually has a bug-free (probably) algorithm to sort steps of independent recipes. Suhel is carrying he's ece project team. Hooray.

4/4 Thu 10:10pm - Modeled time spent cooking vs total time according to the recipe. The current function structured should be fairly scalable & expandable. I am opened to any compliments.

4/9 10:23pm - tries to draw stuff on the frontend. Maybe D3 would useful?

4/10 10:11pm - after learning the basics of d3 and framer motion, we're able to get position data with d3 and animate svg elements with fm. Pretty smooth.

4/11 10:18pm - Makes graphs into nice components, with parent component to further control animation behavior of multiple graphs.

4/12 8:20pm - Takes in list of recipe in json format and draws out the graph. Needs to be done with animation soon.

4/13 8:05pm - Animation minimally completed. It can be improved if nodes move in sequence, but that is more trivial. There are problem with the current returned value of the api. We should return the step in order when they are "started", not completed. It might be easier to store start and end time, or just start + time. I need to think a little about this.

4/15 11:16 Slowly pulling everything together...
Recipe Scrapping -> Is there (Still got environment issue locally)
Recipe Parsing -> Is there
Recipe Aggregation -> Is there (So much UI stuff to work through)

4/17 12:45am Usecallback can get the component dimension even when the component is not innitially mounted, which makes it so much better than useref. Dealing with svg component and animation is pain, but I did learn a lot.
