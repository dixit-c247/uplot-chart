import React from 'react';
import UplotChart from './components/upLotChart/UplotChart';

const App = () => {

  const datasets: any= [
    {
      data: [
        { x: 0, y: 10 },
        { x: 1, y: 20 },
        { x: 2, y: 30 },
        { x: 3, y: 40 },
        { x: 4, y: 50 },
      ],
    },
    {
      data: [
        { x: 0, y: -10 },
        { x: 1, y: 20 },
        { x: 2, y: 30 },
        { x: 3, y: -40 },
        { x: 4, y: -50 },
      ],
    },
    // Add more datasets as needed
  ];



  return (
    <div>
      <h1>uPlot Chart with Tooltip in React.js</h1>
      {/* <UplotChart /> */}
      <UplotChart datasets={datasets} />;
    </div>
  );
};

export default App;
