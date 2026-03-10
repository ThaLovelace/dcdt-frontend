import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [{ name: 'Score', value: 72 }, { name: 'Remaining', value: 28 }];

const COLORS = ['#00C000', '#FFCC00', '#FF0000']; // Green, Yellow, Red

const getColor = (score: number) => {
    if (score >= 80) return COLORS[0];
    if (score >= 50) return COLORS[1];
    return COLORS[2];
};

const BhiGauge = () => {
    return (
        <div>
            <h2>Brain Health Index</h2>
            <PieChart width={200} height={200}>
                <Pie
                    data={data}
                    cx={100}
                    cy={100}
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColor(data[0].value)} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
            <p>Score: 72%</p>
        </div>
    );
};

export default BhiGauge;
