import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import RecipeGraph from './RecipeGraph';
import Modal from '@mui/material/Modal';
import AggregatedRecipeGraph from './AggregatedRecipeGraph';
import GanttChart from './GanttChart';
import Box from '@mui/material/Box';
import { ButtonW } from '../components/ButtonW';

function scheduleListToGantt(scheduleList) {
    let rows = [];
    let prevStep = '';
    for (let stepTime of scheduleList) {
        let step = stepTime[0];
        let taskId = step.step_id;
        let taskName = step.name;
        let resource = step.step_id.split('-')[0];
        let date = new Date(2003, 4, 28, 12, 0, 0, 0);
        date.setSeconds(date.getSeconds() + stepTime[1] * 60);
        let startTime = date;
        let duration = step.time;

        rows.push([
            taskId,
            taskName,
            resource,
            startTime,
            null,
            duration * 60 * 1000,
            100,
            null,
        ]);
        prevStep = taskId;
    }

    return rows;
}

function recipeJsonToHierarchy(json) {
    function dfs(root, nodeDict) {
        if (root.dependency.length === 0) {
            return { name: root.step_id };
        }
        let l = [];
        for (let dep of root.dependency) {
            let children = dfs(nodeDict[dep], nodeDict);
            l.push(children);
        }
        return { name: root.step_id, children: l };
    }
    let nodeDict = {};
    // Assume tree structure
    let allSteps = json.steps.map((step) => {
        return step.step_id;
    });
    let lastSteps = allSteps.reduce((acc, item) => {
        acc[item] = 1;
        return acc;
    }, {});

    for (let step of json.steps) {
        nodeDict[step.step_id] = step;

        for (let dep of step.dependency) {
            // if a step is dependency of other step, this step is not last step
            if (dep in lastSteps) {
                delete lastSteps[dep];
            }
        }
    }
    // at this point, lastSteps contains only the last steps
    let recipeName = json.name;
    let root = { name: recipeName + '-DONE', children: [] };
    for (let step of Object.keys(lastSteps)) {
        let a = dfs(nodeDict[step], nodeDict);
        root.children.push(a);
    }

    return root;
}

function linearRecipeToHierarchy(json) {
    const allSteps = json.steps;
    // Hierarchy: Done -> ... -> Start
    function rec(currInd) {
        if (currInd === 0) {
            return { name: allSteps[currInd].step_id };
        }
        let children = [rec(currInd - 1)];
        return { name: allSteps[currInd].step_id, children: children };
    }
    let root = allSteps.length - 1;
    let hiearchy = rec(root);

    return { name: 'Aggregated-DONE', children: [hiearchy] };
}
const ModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 4,
    outline: 'none',
    p: 4,
    gap: '1rem',
};

const colors = ['#ff8a1d', '#ffc700', '#ff84a9'];
const GraphVis = ({ recipeList, aggregatedRecipe }) => {
    const [drawNode, setDrawNode] = useState([]);
    const [drawPath, setDrawPath] = useState([]);

    const [targetNode, setTargetNode] = useState([]);
    const [targetPath, setTargetPath] = useState([]);

    const [nodeAnimPosition, setNodeAnimPosition] = useState({});
    const [colorMap, setColorMap] = useState({});
    const [ganttData, setGanttData] = useState([]);
    // Dimensions of the graph
    const width = 400;
    const height = 100;

    // ui states
    const [open, setOpen] = useState(true);
    const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

    function enterCookMode() {
        console.log('Cooking Mode');
        navigate('/cook-mode', { state: { recipe: aggregatedRecipe } });
    }

    // graph dimensions & positions
    const [recipeGraphWidth, setRecipeGraphWidth] = useState(0);

    // navigate to cook-mode
    const navigate = useNavigate();

    useEffect(() => {
        if (recipeGraphWidth === 0) {
            return;
        }

        let root;
        let drawNodes = [];
        let drawPaths = [];

        for (let recipe of recipeList) {
            let data = recipeJsonToHierarchy(recipe);
            root = d3.hierarchy(data);
            const graph = d3.cluster().size([height, recipeGraphWidth]);

            graph(root);

            let links = root.links();
            let nodes = root.descendants();
            let plottedNode = {};
            let plottedEdge = {};
            for (let link of links) {
                let edge =
                    link.source.data.name + '<->' + link.target.data.name;

                if (edge in plottedEdge) {
                    links = links.filter((l) => l !== link);
                } else {
                    plottedEdge[edge] = 1;
                }
                // if target is already in plotted node, then set the target to the first plotted node
                let target = link.target;
                if (target.data.name in plottedNode) {
                    link.target = plottedNode[target.data.name];
                    nodes = nodes.filter((n) => n !== target);
                } else {
                    plottedNode[target.data.name] = target;
                }
            }

            drawNodes = [...drawNodes, nodes];
            drawPaths = [...drawPaths, links];
        }
        setDrawNode(drawNodes);
        setDrawPath(drawPaths);

        let targetData = linearRecipeToHierarchy(aggregatedRecipe);
        root = d3.hierarchy(targetData);
        const targetGraph = d3
            .cluster()
            .size([height, svgDimensions.width - 100]);
        targetGraph(root);

        const targetLinks = root.links();
        const targetNodes = root.descendants();

        setTargetNode(targetNodes);
        setTargetPath(targetLinks);

        let animPos = {};
        let cMap = {};
        // Calculate position for start node
        for (let targetNode of targetNodes.slice(1)) {
            let stepId = targetNode.data.name;

            let sourceNode = null;
            let i = 0;
            for (let sourceNodes of drawNodes) {
                for (let source of sourceNodes) {
                    let sourceId = source.data.name;
                    if (sourceId === stepId) {
                        sourceNode = source;
                        break;
                    }
                }
                if (sourceNode !== null) {
                    break;
                }
                i++;
            }

            const marginTop = 40;
            const marginLeft = 30;
            const offset = svgDimensions.width / recipeList.length;

            let w = recipeGraphWidth;
            let mx = marginLeft + offset * i;
            let my = marginTop;

            let x = w - sourceNode.y + mx;
            let y = sourceNode.x + my;
            animPos[stepId] = [x, y];
            cMap[stepId] = colors[i];
        }
        setNodeAnimPosition(animPos);
        setColorMap(cMap);

        let scheduleList = aggregatedRecipe.schedule;
        let gd = scheduleListToGantt(scheduleList);
        setGanttData(gd);
        setOpen(true);
    }, [recipeGraphWidth]);

    // then, update width
    useEffect(() => {
        if (svgDimensions.width === 0) return;
        console.log('graph width', svgDimensions.width);
        if (recipeList && recipeList.length > 0) {
            setRecipeGraphWidth(svgDimensions.width / recipeList.length - 50);
        }
    }, [svgDimensions]);

    const measuredRef = useCallback((node) => {
        const getElementDimensions = () => {
            if (node) {
                const { width, height } = node.getBoundingClientRect();
                setSvgDimensions({ width, height });
            }
        };

        // Call the function initially and whenever the window is resized
        getElementDimensions();
        window.addEventListener('resize', getElementDimensions);
    }, []);

    return (
        <div className="graph-vis">
            <h2>Your Meal is Ready, Chef</h2>
            {true ? (
                <>
                    <Modal
                        open={open}
                        onClose={() => setOpen(false)}
                        className="modal">
                        <Box sx={ModalStyle}>
                            <h3>Here's The Schedule, Chef.</h3>
                            <div className="space">
                                <svg className={'svg-space'} ref={measuredRef}>
                                    {recipeList &&
                                        aggregatedRecipe &&
                                        drawNode.length === recipeList.length &&
                                        recipeList.map((rec, i) => {
                                            const marginTop = 40;
                                            const marginLeft = 30;
                                            const offset =
                                                svgDimensions.width /
                                                recipeList.length;
                                            return (
                                                <g key={rec.name + '_group'}>
                                                    <text
                                                        x={
                                                            marginLeft +
                                                            offset * i
                                                        }
                                                        y={marginTop - 10}
                                                        key={rec.name + 'title'}
                                                        fontSize={'12'}>
                                                        {i +
                                                            1 +
                                                            '. ' +
                                                            rec.name}
                                                    </text>
                                                    <RecipeGraph
                                                        key={rec.name + 'graph'}
                                                        nodes={drawNode[i]}
                                                        paths={drawPath[i]}
                                                        width={recipeGraphWidth}
                                                        marginX={
                                                            marginLeft +
                                                            offset * i
                                                        }
                                                        marginY={marginTop}
                                                        color={colors[i]}
                                                    />
                                                </g>
                                            );
                                        })}
                                    {recipeList && aggregatedRecipe && (
                                        <AggregatedRecipeGraph
                                            key={'aggregated-graph'}
                                            nodes={targetNode}
                                            paths={targetPath}
                                            width={svgDimensions.width - 100}
                                            marginX={50}
                                            marginY={150}
                                            nodesAnimPosition={nodeAnimPosition}
                                            colorMap={colorMap}
                                        />
                                    )}
                                </svg>
                            </div>
                            <ButtonW
                                onClick={() => setOpen(false)}
                                variant="contained">
                                Get Started!
                            </ButtonW>
                        </Box>
                    </Modal>

                    {recipeList && aggregatedRecipe && (
                        <div className="gantt-chart-container">
                            <GanttChart data={ganttData} />
                        </div>
                    )}

                    <ButtonW
                        onClick={() => {
                            enterCookMode();
                        }}
                        variant="contained">
                        Cook Mode
                    </ButtonW>
                </>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default GraphVis;
