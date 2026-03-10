// screen-5-report.tsx

import React from 'react';
import { BhiGauge } from './BhiGauge';
import { DrawingReplay } from './DrawingReplay';
import DonutChart from './DonutChart';

const Screen5Report = () => {
    return (
        <div>
            <h1>SCREEN 5 Report</h1>
            <BhiGauge />
            <DrawingReplay />
            <div>
                <h2>K-Series Clinical Breakdown</h2>
                <DonutChart />
            </div>
        </div>
    );
};

export default Screen5Report;
