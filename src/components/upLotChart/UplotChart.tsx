import React, { useEffect, useRef, useState } from "react";
import uPlot, { Options, AlignedData } from "uplot";

interface Dataset {
  data: { x: number; y: number }[];
  color: string;
}

const prepareData = (data: { x: number; y: number }[]): AlignedData => {
  const xs = new Float64Array(data.length);
  const ys = new Float64Array(data.length);

  data.forEach(({ x, y }, i) => {
    xs[i] = x;
    ys[i] = y;
  });

  return [xs, ys];
};

interface MultiPanelChartProps {
  datasets: Dataset[];
}

const UplotChart: React.FC<MultiPanelChartProps> = ({ datasets }) => {
  const chartRefs = useRef<uPlot[]>([]);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipRef2 = useRef<HTMLDivElement>(null);
  const [tooltipValues, setTooltipValues] = useState<
    { left: number; top: number }[]
  >(datasets.map(() => ({ left: -10, top: -10 })));

  let mooSync = uPlot.sync("moo")

  const setCursorFn = (self: uPlot | any, cursor?: uPlot.Cursor) => {
    if (self && self.cursor.left != null && self.cursor.top != null) {
      const seriesValues: { left: number; top: number }[] = [];
      datasets.forEach((_, seriesIdx) => {
        const valueLeft = self.posToVal(self.cursor.left, "x");
        const valueTop = self.posToVal(self.cursor.top, "y", seriesIdx);
        seriesValues.push({ left: valueLeft ?? 0, top: valueTop ?? 0 });
      });
  
      setTooltipValues(seriesValues);
    } else {
      setTooltipValues(datasets.map(() => ({ left: 0, top: 0 })));
    }
  };

  const matchSyncKeys = (own: any, ext: any) => own === ext 
const chartHeight = 400
  useEffect(() => {
    chartRefs.current = datasets.map((dataset) => {
     
      const opts: Options = {
        width: 400,
        height: chartHeight,
        scales: {
          x: { time: false },
          y: { auto: true },
        },
        cursor: {
          lock:true,
          focus: {
            prox: 16
          },
          sync: {
            key: mooSync.key,
            match: [matchSyncKeys, matchSyncKeys],
          }
        },
        series: [
          {},
          {
            stroke: "red",
            fill: "rgba(255,0,0,0.1)",
          },
        ],
        hooks: {
          setCursor: [setCursorFn] as any,
        },
      };

      const alignedData = prepareData(dataset.data);

      const chart = new uPlot(
        opts,
        alignedData,
        document.createElement("div")
      ) as uPlot;

      document.getElementById("uplot-container")?.appendChild(chart.root);

      return chart;
    });

    return () => {
      chartRefs.current.forEach((chart) => {
        if (chart) {
          chart.destroy();
        }
      });
    };
  }, [datasets]);

  useEffect(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.display = "block";
      tooltipRef.current.style.left = `${tooltipValues[0].left}px`;
      tooltipRef.current.style.top = `${tooltipValues[0].top - 30}px`;
      tooltipRef.current.innerHTML = tooltipValues
        .map(
          (value, index) =>
            `Dataset ${index + 1}: X: ${value.left.toFixed(
              2
            )}, Y: ${value.top.toFixed(2)}`
        )
        .join("<br/>");
    }
  }, [tooltipValues]);
  useEffect(() => {
    if (tooltipRef2.current) {
      tooltipRef2.current.style.display = "block";
      tooltipRef2.current.style.left = `${tooltipValues[0].left}px`;
      tooltipRef2.current.style.top = `${tooltipValues[0].top + (chartHeight * 2)}px`;
      tooltipRef2.current.innerHTML = tooltipValues
        .map(
          (value, index) =>
            `Dataset ${index + 1}: X: ${value.left.toFixed(
              2
            )}, Y: ${value.top.toFixed(2)}`
        )
        .join("<br/>");
    }
  }, [tooltipValues]);

  return (
    <div style={{ position: "relative" }}>
      <div id="uplot-container"></div>
      <div
        ref={tooltipRef}
        style={{
          display: "none",
          position: "absolute",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "5px",
          borderRadius: "5px",
        }}
      ></div>
      <div
        ref={tooltipRef2}
        style={{
          display: "none",
          position: "absolute",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "5px",
          borderRadius: "5px",
        }}
      ></div>
    </div>
  );
};

export default UplotChart;

