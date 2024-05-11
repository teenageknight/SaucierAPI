import React from 'react';
import { Chart } from 'react-google-charts';
const GanttChart = ({ data }) => {
    function daysToMilliseconds(days) {
        return days * 24 * 60 * 60 * 1000;
    }

    const columns = [
        { type: 'string', label: 'Task ID' },
        { type: 'string', label: 'Task Name' },
        { type: 'string', label: 'Resource' },
        { type: 'date', label: 'Start Date' },
        { type: 'date', label: 'End Date' },
        { type: 'number', label: 'Duration' },
        { type: 'number', label: 'Percent Complete' },
        { type: 'string', label: 'Dependencies' },
    ];

    const dummy_data = [columns, ...data];

    return (
        <div>
            <Chart
                chartType="Gantt"
                width="100%"
                height="800px"
                data={dummy_data}
            />
        </div>
    );
};

export default GanttChart;
