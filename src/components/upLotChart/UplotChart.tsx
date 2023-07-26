import React, { useEffect, useRef, useState } from "react";
import uPlot, { Options, AlignedData } from "uplot";

// Helper function to convert the data to Typed Arrays
const prepareData = (data: { x: number; y: number }[]): AlignedData => {
  const xs = new Float64Array(data.length);
  const ys = new Float64Array(data.length);

  data.forEach(({ x, y }, i) => {
    xs[i] = x;
    ys[i] = y;
  });

  return [xs, ys];
};

const UplotChart: React.FC = () => {
  const chartRef = useRef<uPlot | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipValue, setTooltipValue] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);

  const setCursorFn = (self: uPlot, cursor?: uPlot.Cursor) => {
    if (self && self.cursor.left != null && self.cursor.top != null) {
      setCursorPosition({ left: self.cursor.left, top: self.cursor.top });

      const seriesIdx = 0;
      const valueLeft = self.posToVal(self.cursor.left, "x");
      const valueTop = self.posToVal(self.cursor.top, "y");

      if (self.data && self.data[seriesIdx]) {
        setTooltipValue({ left: valueLeft, top: valueTop });
      } else {
        setTooltipValue(null);
      }
    } else {
      setCursorPosition(null); // Reset cursor position when it becomes undefined
    }
  };

  useEffect(() => {
    const data = [
      { x: 0, y: 10 },
      { x: 1, y: 15 },
      { x: 2, y: -25 },
      { x: 3, y: -35 },
      { x: 4, y: -40 },
    ];

    const opts: Options = {
      width: 1000,
      height: 500,
      scales: {
        x: { time: false },
        y: { auto: true },
      },
      series: [{}, {}],
      hooks: {
        setCursor: [setCursorFn] as any, // Use the type assertion for setCursor hook
      },
    };

    const alignedData = prepareData(data);

    chartRef.current = new uPlot(
      opts,
      alignedData,
      document.getElementById("uplot-chart") as HTMLElement
    ) as uPlot;

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (tooltipValue && cursorPosition && tooltipRef.current) {
      const { left, top } = tooltipValue;
      const { left: positionLeft, top: positionTop } = cursorPosition;

      console.log("tooltipValue", tooltipValue, cursorPosition)
      if (positionLeft !== -10 && positionTop !== -10) {
        tooltipRef.current.innerHTML = `X: ${left.toFixed(2)}, Y: ${top.toFixed(
          2
        )}`;
        tooltipRef.current.style.display = "block";
        tooltipRef.current.style.left = `${positionLeft}px`;
        tooltipRef.current.style.top = `${positionTop - 30}px`;
      } else {
        tooltipRef.current.style.display = "none";
      }
    } else if (tooltipRef.current) {
      tooltipRef.current.style.display = "none";
    }
  }, [cursorPosition, tooltipValue]);

  return (
    <div style={{ position: "relative" }}>
      <div id="uplot-chart"></div>
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
    </div>
  );
};

export default UplotChart;
