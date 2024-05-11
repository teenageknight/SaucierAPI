import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
const RecipeGraph = ({ nodes, paths, width, marginX, marginY, color }) => {
    const [hoverControl, setHoverControl] = useState({ x: 0, y: 0, text: '' }); // ID of the node that is being hovered

    const StepCardOnHover = ({ text, x, y }) => {
        const offsetX = 5;
        const offsetY = 5;
        const textRef = useRef(null);
        const rectPadding = 10; // Add padding around the text

        const [dimension, setDimension] = useState({ w: 0, h: 0 });

        useEffect(() => {
            const textElement = textRef.current;
            const bbox = textElement.getBBox();
            const newWidth = bbox.width + rectPadding * 2; // Add padding on both sides
            const newHeight = bbox.height + rectPadding * 2; // Add padding on top and bottom

            setDimension({ w: newWidth, h: newHeight });
        }, []);
        return (
            <>
                {/* Rectangle */}
                <motion.rect
                    className="card-on-hover"
                    x={x + offsetX}
                    y={y + offsetY}
                    width={dimension.w}
                    height={dimension.h}
                    fill={'rgb(255, 233, 201)'}
                    rx="10"
                    ry="10"
                    style={{ display: text === '' ? 'none' : 'block' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                />

                {/* Text */}
                <motion.text
                    className="card-on-hover-text"
                    ref={textRef}
                    x={x + offsetX + rectPadding}
                    y={y + offsetY + rectPadding}
                    textAnchor="start"
                    dominantBaseline="text-before-edge"
                    fill="black"
                    style={{ display: text === '' ? 'none' : 'block' }}
                    fontSize={12}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}>
                    {text}
                </motion.text>
            </>
        );
    };
    return (
        <>
            {paths.map((d) => {
                let pathName = d.source.data.name + '-' + d.target.data.name;
                let pathD = d3
                    .linkHorizontal()
                    .x((d) => width - d.y + marginX)
                    .y((d) => d.x + marginY)(d);

                return (
                    <motion.path
                        key={pathName}
                        className={'g-path'}
                        d={pathD} // d3.linkHorizontal is a path generator function
                        style={{
                            fill: 'none',
                            stroke: '#ccc',
                            strokeWidth: 2,
                        }}
                        initial={{ pathLength: 0, pathOffset: 1 }}
                        animate={{ pathLength: 1, pathOffset: 0 }}
                        transition={{ type: 'spring', duration: 0.8 }}
                    />
                );
            })}
            {nodes.map((d) => {
                let x = width - d.y + marginX;
                let y = d.x + marginY;
                return (
                    <motion.circle
                        key={d.data.name}
                        r="5"
                        cx={x}
                        cy={y}
                        fill={color}
                        onMouseEnter={(e) => {
                            setHoverControl({
                                text: d.data.name,
                                x: x,
                                y: y,
                            });
                        }}
                        onMouseLeave={() => {
                            setHoverControl({ text: '', x: x, y: y });
                        }}
                        initial={{
                            scale: 0,
                        }}
                        animate={{
                            scale: 1,
                        }}
                        transition={{
                            damping: 10,
                            type: 'spring',
                            duration: 0.8,
                            x: { duration: 1 },
                        }}
                    />
                );
            })}

            {nodes.map((d) => {
                let x = width - d.y - 15 + marginX;
                let y = d.x - 5 + marginY;
                return (
                    <motion.text
                        key={d.data.name}
                        r="5"
                        x={x}
                        y={y}
                        fill={'#000'}
                        initial={{
                            scale: 0,
                        }}
                        animate={{
                            scale: 1,
                        }}
                        transition={{
                            type: 'spring',
                            duration: 0.8,
                        }}
                        fontSize={'12'}>
                        {d.data.name.split('-')[1]}
                    </motion.text>
                );
            })}
            <StepCardOnHover
                text={hoverControl.text}
                x={hoverControl.x}
                y={hoverControl.y}
            />
        </>
    );
};

export default RecipeGraph;
